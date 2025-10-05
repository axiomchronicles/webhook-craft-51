import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

interface WebhookPayload {
  event_type: string;
  payload: any;
  source?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify API key from header
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify API key exists in database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("user_id, is_active")
      .eq("key_hash", apiKey)
      .single();

    if (apiKeyError || !apiKeyData || !apiKeyData.is_active) {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive API key" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = apiKeyData.user_id;

    // Update API key last used timestamp
    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("key_hash", apiKey);

    // Parse webhook payload
    const webhookData: WebhookPayload = await req.json();
    const headers = Object.fromEntries(req.headers.entries());

    // Store incoming event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        user_id: userId,
        event_type: webhookData.event_type,
        payload: webhookData.payload,
        source: webhookData.source || req.headers.get("user-agent"),
        headers: headers,
        processed: false,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error storing event:", eventError);
      throw eventError;
    }

    console.log("Event stored:", event.id);

    // Get all active endpoints for this user
    const { data: endpoints, error: endpointsError } = await supabase
      .from("endpoints")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (endpointsError) {
      console.error("Error fetching endpoints:", endpointsError);
      throw endpointsError;
    }

    // Create delivery records for each endpoint
    const deliveries = endpoints.map((endpoint) => ({
      endpoint_id: endpoint.id,
      event_id: event.id,
      user_id: userId,
      status: "pending",
      request_payload: webhookData.payload,
      request_headers: endpoint.headers || {},
      max_attempts: endpoint.retry_config?.max_attempts || 3,
    }));

    if (deliveries.length > 0) {
      const { error: deliveriesError } = await supabase
        .from("deliveries")
        .insert(deliveries);

      if (deliveriesError) {
        console.error("Error creating deliveries:", deliveriesError);
        throw deliveriesError;
      }

      console.log(`Created ${deliveries.length} delivery records`);
    }

    // Trigger webhook processor (this would be handled by a separate cron job or queue)
    // For now, we'll just return success
    return new Response(
      JSON.stringify({
        success: true,
        event_id: event.id,
        deliveries_queued: deliveries.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
