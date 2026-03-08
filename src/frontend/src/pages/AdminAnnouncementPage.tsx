import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAnnouncementBanner,
  useSetAnnouncementBanner,
} from "../hooks/useProducts";

export default function AdminAnnouncementPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: banner, isLoading } = useGetAnnouncementBanner();
  const setAnnouncementBanner = useSetAnnouncementBanner();

  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState(
    "Free worldwide shipping on orders over $75",
  );

  useEffect(() => {
    if (banner) {
      setEnabled(banner.enabled);
      setMessage(
        banner.message || "Free worldwide shipping on orders over $75",
      );
    }
  }, [banner]);

  if (!identity) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">
              Please log in to access this page
            </p>
            <Button onClick={() => navigate({ to: "/" })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a banner message");
      return;
    }

    try {
      await setAnnouncementBanner.mutateAsync({
        enabled,
        message: message.trim(),
      });
      toast.success("Announcement banner updated!");
    } catch (error) {
      console.error("Failed to update announcement banner:", error);
      toast.error("Failed to update announcement banner");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/admin" })}
        className="mb-6"
        data-ocid="announcement.secondary_button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Announcement Banner</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Live preview */}
            {enabled && message.trim() && (
              <div className="rounded-lg overflow-hidden">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Preview
                </p>
                <div className="bg-primary text-primary-foreground text-center py-2.5 px-4 text-sm font-medium rounded">
                  {message}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Banner Enabled</p>
                <p className="text-sm text-muted-foreground">
                  Show the announcement bar at the top of the site
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                data-ocid="announcement.switch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Banner Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Free worldwide shipping on orders over $75"
                data-ocid="announcement.input"
              />
              <p className="text-xs text-muted-foreground">
                This message will be shown to all visitors when the banner is
                enabled.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={setAnnouncementBanner.isPending}
              data-ocid="announcement.submit_button"
            >
              {setAnnouncementBanner.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
