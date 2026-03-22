import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Lock,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { ShoppingItem } from "../backend";
import { useCart } from "../contexts/CartContext";
import { useCreateCheckoutSession } from "../hooks/useStripeCheckout";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();
  const createCheckoutSession = useCreateCheckoutSession();

  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: "/cart" });
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  const handlePayment = async () => {
    try {
      const productItems: ShoppingItem[] = items.map((item) => ({
        productName: item.product.name,
        productDescription: `Size: ${item.size} | Color: ${item.color}`,
        priceInCents: BigInt(item.product.price),
        quantity: BigInt(item.quantity),
        currency: "usd",
      }));

      const session = await createCheckoutSession.mutateAsync(productItems);

      if (!session?.url) {
        throw new Error("Stripe session missing url");
      }

      window.location.href = session.url;
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to initiate payment";
      toast.error(message);
    }
  };

  const subtotal = getCartTotal();

  return (
    <div className="container py-12">
      <div className="max-w-lg mx-auto">
        <Link to="/cart" data-ocid="payment.link">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </Link>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Item list */}
            <div className="space-y-4" data-ocid="payment.list">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 items-start"
                  data-ocid={`payment.item.${index + 1}`}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-accent/10 flex-shrink-0 border border-border">
                    {item.product.imageUrls.length > 0 ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">
                      {item.product.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {item.size}
                      </Badge>
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {item.color}
                      </Badge>
                      {item.quantity > 1 && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          ×{item.quantity}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary">
                      ${((item.product.price * item.quantity) / 100).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ${(item.product.price / 100).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Shipping
                </span>
                <span className="font-medium text-green-400 flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  Free
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Stripe trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground/60">
              <Lock className="h-3 w-3" />
              <span className="text-xs">Secured by</span>
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: "#635BFF" }}
              >
                Stripe
              </span>
            </div>

            <Button
              onClick={handlePayment}
              disabled={createCheckoutSession.isPending}
              className="w-full"
              size="lg"
              data-ocid="payment.primary_button"
            >
              {createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ${(subtotal / 100).toFixed(2)} with Stripe
                </>
              )}
            </Button>

            {createCheckoutSession.isPending && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                Setting up your secure payment session...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
