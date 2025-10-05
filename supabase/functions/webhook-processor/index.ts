import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Get pending deliveries
    const { data: deliveries, error: deliveriesError } = await supabase
      .from("deliveries")
      .select(`
        *,
        endpoints:endpoint_id (*)
      `)
      .in("status", ["pending", "retrying"])
      .order("created_at", { ascending: true })
      .limit(10);

    if (deliveriesError) {
      console.error("Error fetching deliveries:", deliveriesError);
      throw deliveriesError;
    }

    console.log(`Processing ${deliveries?.length || 0} deliveries`);

    const results = [];

    for (const delivery of deliveries || []) {
      const endpoint = delivery.endpoints;
      
      // Check if we should retry based on next_retry_at
      if (delivery.next_retry_at && new Date(delivery.next_retry_at) > new Date()) {
        console.log(`Skipping delivery ${delivery.id} - not yet time to retry`);
        continue;
      }

      // Check if max attempts reached
      if (delivery.attempt_count >= delivery.max_attempts) {
        console.log(`Delivery ${delivery.id} exceeded max attempts`);
        await supabase
          .from("deliveries")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            error_message: "Max retry attempts exceeded",
          })
          .eq("id", delivery.id);
        continue;
      }

      console.log(`Attempting delivery ${delivery.id} to ${endpoint.url}`);

      const startTime = Date.now();

      try {
        // Prepare request headers
        const requestHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...endpoint.headers,
        };

        // Add signature if secret is configured
        if (endpoint.secret) {
          // Simple HMAC signature (in production, use proper crypto)
          requestHeaders["X-Webhook-Signature"] = endpoint.secret;
        }

        // Make HTTP request to endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout_ms || 30000);

        const response = await fetch(endpoint.url, {
          method: endpoint.method || "POST",
          headers: requestHeaders,
          body: JSON.stringify(delivery.request_payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseTime = Date.now() - startTime;
        const responseBody = await response.text();
        const responseHeaders = Object.fromEntries(response.headers.entries());

        if (response.ok) {
          // Success
          console.log(`Delivery ${delivery.id} succeeded`);
          await supabase
            .from("deliveries")
            .update({
              status: "success",
              attempt_count: delivery.attempt_count + 1,
              response_status: response.status,
              response_body: responseBody.substring(0, 1000), // Limit response body size
              response_headers: responseHeaders,
              response_time_ms: responseTime,
              completed_at: new Date().toISOString(),
            })
            .eq("id", delivery.id);

          results.push({ id: delivery.id, status: "success" });
        } else {
          // Failed, schedule retry
          const nextAttempt = delivery.attempt_count + 1;
          const backoffMs = (endpoint.retry_config?.backoff_ms || 1000) * Math.pow(2, delivery.attempt_count);
          const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();

          console.log(`Delivery ${delivery.id} failed with status ${response.status}`);
          
          await supabase
            .from("deliveries")
            .update({
              status: nextAttempt < delivery.max_attempts ? "retrying" : "failed",
              attempt_count: nextAttempt,
              response_status: response.status,
              response_body: responseBody.substring(0, 1000),
              response_headers: responseHeaders,
              response_time_ms: responseTime,
              error_message: `HTTP ${response.status}: ${response.statusText}`,
              next_retry_at: nextAttempt < delivery.max_attempts ? nextRetryAt : null,
              completed_at: nextAttempt >= delivery.max_attempts ? new Date().toISOString() : null,
            })
            .eq("id", delivery.id);

          results.push({ id: delivery.id, status: "retry_scheduled" });
        }
      } catch (error: any) {
        // Error making request
        const responseTime = Date.now() - startTime;
        const nextAttempt = delivery.attempt_count + 1;
        const backoffMs = (endpoint.retry_config?.backoff_ms || 1000) * Math.pow(2, delivery.attempt_count);
        const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();

        console.error(`Delivery ${delivery.id} error:`, error.message);

        await supabase
          .from("deliveries")
          .update({
            status: nextAttempt < delivery.max_attempts ? "retrying" : "failed",
            attempt_count: nextAttempt,
            response_time_ms: responseTime,
            error_message: error.message,
            next_retry_at: nextAttempt < delivery.max_attempts ? nextRetryAt : null,
            completed_at: nextAttempt >= delivery.max_attempts ? new Date().toISOString() : null,
          })
          .eq("id", delivery.id);

        results.push({ id: delivery.id, status: "error", error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        processed: results.length,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in webhook processor:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
