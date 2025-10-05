import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Delivery {
  id: string;
  endpoint_id: string;
  event_id?: string;
  user_id: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempt_count: number;
  max_attempts: number;
  request_payload?: any;
  request_headers?: Record<string, string>;
  response_status?: number;
  response_body?: string;
  response_headers?: Record<string, string>;
  response_time_ms?: number;
  error_message?: string;
  created_at: string;
  next_retry_at?: string;
  completed_at?: string;
}

export function useDeliveries(endpointId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deliveries, isLoading, error } = useQuery({
    queryKey: ["deliveries", endpointId],
    queryFn: async () => {
      let query = supabase
        .from("deliveries")
        .select(`
          *,
          endpoints:endpoint_id (name, url)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (endpointId) {
        query = query.eq("endpoint_id", endpointId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Delivery & { endpoints: { name: string; url: string } })[];
    },
  });

  const retryDelivery = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("deliveries")
        .update({
          status: 'retrying',
          next_retry_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Delivery;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      toast({
        title: "Success",
        description: "Delivery queued for retry",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    deliveries,
    isLoading,
    error,
    retryDelivery,
  };
}
