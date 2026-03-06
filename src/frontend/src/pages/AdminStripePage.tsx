import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminStripePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();

  const [secretKey, setSecretKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Redirect to admin if not authenticated
  useEffect(() => {
    if (!identity) {
      navigate({ to: "/admin" });
    }
  }, [identity, navigate]);

  // Check current Stripe configuration status
  useEffect(() => {
    if (!actor || actorFetching) return;
    setIsCheckingStatus(true);
    actor
      .isStripeConfigured()
      .then((configured) => {
        setIsConfigured(configured);
      })
      .catch(() => {
        setIsConfigured(false);
      })
      .finally(() => {
        setIsCheckingStatus(false);
      });
  }, [actor, actorFetching]);

  if (!identity) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      toast.error("Please enter your Stripe secret key");
      return;
    }

    if (!actor) {
      toast.error("Not connected — please try again");
      return;
    }

    setIsSaving(true);
    try {
      await actor.setStripeConfiguration({
        secretKey: secretKey.trim(),
        allowedCountries: [],
      });
      toast.success("Stripe configuration saved!");
      setIsConfigured(true);
      setSecretKey(""); // Clear sensitive input after save
    } catch (error) {
      console.error("Failed to save Stripe configuration:", error);
      toast.error("Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-12 max-w-2xl">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/admin" })}
        className="mb-6 -ml-2"
        data-ocid="stripe.link"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Stripe Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure your payment gateway
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="mb-6">
        {isCheckingStatus || actorFetching ? (
          <div
            className="flex items-center gap-2 text-muted-foreground text-sm"
            data-ocid="stripe.loading_state"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking configuration status...
          </div>
        ) : isConfigured ? (
          <Badge
            variant="outline"
            className="border-green-500/50 text-green-400 bg-green-500/10 gap-1.5 px-3 py-1"
            data-ocid="stripe.success_state"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Stripe is configured
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 gap-1.5 px-3 py-1"
            data-ocid="stripe.error_state"
          >
            <XCircle className="h-3.5 w-3.5" />
            Stripe not configured
          </Badge>
        )}
      </div>

      {/* Configuration form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="secret-key">Stripe Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_..."
                autoComplete="off"
                data-ocid="stripe.input"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can find your secret key in the Stripe dashboard under{" "}
                <strong>Developers → API Keys</strong>. Use a test key (
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  sk_test_...
                </code>
                ) for testing before going live.
              </p>
            </div>

            {/* Info box */}
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">How to get started:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>
                  Go to{" "}
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    stripe.com
                  </a>{" "}
                  and sign in
                </li>
                <li>
                  Switch to <strong>Test Mode</strong> using the toggle in the
                  top-left
                </li>
                <li>
                  Go to <strong>Developers → API Keys</strong>
                </li>
                <li>Copy your Secret Key and paste it above</li>
                <li>
                  To test payments, use card number{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    4242 4242 4242 4242
                  </code>
                </li>
              </ol>
            </div>

            <Button
              type="submit"
              disabled={isSaving || !secretKey.trim()}
              className="w-full"
              data-ocid="stripe.submit_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
