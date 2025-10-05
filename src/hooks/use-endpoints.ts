import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Endpoint {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  secret?: string;
  status: 'active' | 'inactive' | 'paused';
  retry_config?: {
    max_attempts: number;
    backoff_ms: number;
  };
  timeout_ms: number;
  created_at: string;
  updated_at: string;
  last_triggered_at?: string;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
}

export interface CreateEndpointInput {
  name: string;
  url: string;
  description?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  secret?: string;
  retry_config?: {
    max_attempts: number;
    backoff_ms: number;
  };
  timeout_ms?: number;
}

export function useEndpoints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: endpoints, isLoading, error } = useQuery({
    queryKey: ["endpoints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("endpoints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Endpoint[];
    },
  });

  const createEndpoint = useMutation({
    mutationFn: async (input: CreateEndpointInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("endpoints")
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Endpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast({
        title: "Success",
        description: "Endpoint created successfully",
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

  const updateEndpoint = useMutation({
    mutationFn: async ({ id, ...input }: Partial<Endpoint> & { id: string }) => {
      const { data, error } = await supabase
        .from("endpoints")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Endpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast({
        title: "Success",
        description: "Endpoint updated successfully",
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

  const deleteEndpoint = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("endpoints")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast({
        title: "Success",
        description: "Endpoint deleted successfully",
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

  const toggleEndpointStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' | 'paused' }) => {
      const { data, error } = await supabase
        .from("endpoints")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Endpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast({
        title: "Success",
        description: "Endpoint status updated",
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
    endpoints,
    isLoading,
    error,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    toggleEndpointStatus,
  };
}
