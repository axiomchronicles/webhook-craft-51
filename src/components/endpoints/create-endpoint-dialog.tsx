import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useEndpoints, type CreateEndpointInput } from "@/hooks/use-endpoints";

export function CreateEndpointDialog() {
  const [open, setOpen] = useState(false);
  const { createEndpoint } = useEndpoints();
  const [formData, setFormData] = useState<CreateEndpointInput>({
    name: "",
    url: "",
    description: "",
    method: "POST",
    headers: {},
    timeout_ms: 30000,
    retry_config: {
      max_attempts: 3,
      backoff_ms: 1000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEndpoint.mutateAsync(formData);
    setOpen(false);
    setFormData({
      name: "",
      url: "",
      description: "",
      method: "POST",
      headers: {},
      timeout_ms: 30000,
      retry_config: {
        max_attempts: 3,
        backoff_ms: 1000,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Endpoint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Endpoint Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Webhook Endpoint"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Destination URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.example.com/webhook"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this endpoint..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: any) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout_ms}
                onChange={(e) => setFormData({ ...formData, timeout_ms: parseInt(e.target.value) })}
                min={1000}
                max={60000}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret">Webhook Secret (Optional)</Label>
            <Input
              id="secret"
              type="password"
              value={formData.secret || ""}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              placeholder="Optional signing secret"
            />
            <p className="text-xs text-muted-foreground">
              Used to sign webhook payloads for verification
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_attempts">Max Retry Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                value={formData.retry_config?.max_attempts}
                onChange={(e) => setFormData({
                  ...formData,
                  retry_config: {
                    ...formData.retry_config!,
                    max_attempts: parseInt(e.target.value),
                  },
                })}
                min={0}
                max={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backoff">Backoff (ms)</Label>
              <Input
                id="backoff"
                type="number"
                value={formData.retry_config?.backoff_ms}
                onChange={(e) => setFormData({
                  ...formData,
                  retry_config: {
                    ...formData.retry_config!,
                    backoff_ms: parseInt(e.target.value),
                  },
                })}
                min={100}
                max={60000}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEndpoint.isPending}>
              {createEndpoint.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Endpoint"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
