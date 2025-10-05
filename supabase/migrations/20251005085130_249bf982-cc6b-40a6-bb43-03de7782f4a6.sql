-- Create enum types for webhook system
CREATE TYPE webhook_status AS ENUM ('active', 'inactive', 'paused');
CREATE TYPE delivery_status AS ENUM ('pending', 'success', 'failed', 'retrying');
CREATE TYPE http_method AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- Create endpoints table
CREATE TABLE public.endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  method http_method DEFAULT 'POST',
  headers JSONB DEFAULT '{}'::jsonb,
  secret TEXT,
  status webhook_status DEFAULT 'active',
  retry_config JSONB DEFAULT '{"max_attempts": 3, "backoff_ms": 1000}'::jsonb,
  timeout_ms INTEGER DEFAULT 30000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  total_deliveries INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0
);

-- Create events table (incoming webhooks)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  source TEXT,
  headers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create deliveries table (outgoing webhook attempts)
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES public.endpoints(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status delivery_status DEFAULT 'pending',
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  request_payload JSONB,
  request_headers JSONB,
  response_status INTEGER,
  response_body TEXT,
  response_headers JSONB,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_retry_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create API keys table for authentication
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_endpoints_user_id ON public.endpoints(user_id);
CREATE INDEX idx_endpoints_status ON public.endpoints(status);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX idx_events_processed ON public.events(processed);
CREATE INDEX idx_deliveries_endpoint_id ON public.deliveries(endpoint_id);
CREATE INDEX idx_deliveries_event_id ON public.deliveries(event_id);
CREATE INDEX idx_deliveries_user_id ON public.deliveries(user_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_deliveries_created_at ON public.deliveries(created_at DESC);
CREATE INDEX idx_deliveries_next_retry ON public.deliveries(next_retry_at) WHERE status = 'retrying';
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Enable RLS on all tables
ALTER TABLE public.endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for endpoints
CREATE POLICY "Users can view their own endpoints"
  ON public.endpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own endpoints"
  ON public.endpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own endpoints"
  ON public.endpoints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own endpoints"
  ON public.endpoints FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for deliveries
CREATE POLICY "Users can view their own deliveries"
  ON public.deliveries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deliveries"
  ON public.deliveries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deliveries"
  ON public.deliveries FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for API keys
CREATE POLICY "Users can view their own API keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update endpoint statistics
CREATE OR REPLACE FUNCTION public.update_endpoint_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' AND OLD.status != 'success' THEN
    UPDATE public.endpoints
    SET 
      successful_deliveries = successful_deliveries + 1,
      total_deliveries = total_deliveries + 1,
      last_triggered_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.endpoint_id;
  ELSIF NEW.status = 'failed' AND OLD.status != 'failed' THEN
    UPDATE public.endpoints
    SET 
      failed_deliveries = failed_deliveries + 1,
      total_deliveries = total_deliveries + 1,
      last_triggered_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.endpoint_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update endpoint statistics
CREATE TRIGGER update_endpoint_stats_trigger
  AFTER UPDATE ON public.deliveries
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_endpoint_stats();

-- Trigger for automatic timestamp updates on endpoints
CREATE TRIGGER update_endpoints_updated_at
  BEFORE UPDATE ON public.endpoints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();