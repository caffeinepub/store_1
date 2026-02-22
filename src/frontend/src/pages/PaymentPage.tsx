import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useCreateCheckoutSession } from '../hooks/useStripeCheckout';
import type { ShoppingItem } from '../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items } = useCart();
  const createCheckoutSession = useCreateCheckoutSession();

  useEffect(() => {
    const checkoutData = sessionStorage.getItem('checkoutData');
    if (!checkoutData || items.length === 0) {
      toast.error('No checkout data found');
      navigate({ to: '/cart' });
    }
  }, [items, navigate]);

  const handlePayment = async () => {
    try {
      const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
      
      const shoppingItems: ShoppingItem[] = items.map((item) => ({
        productName: item.product.name,
        productDescription: `${item.product.description} - Size: ${item.size}, Color: ${item.color}`,
        priceInCents: item.product.price,
        quantity: BigInt(item.quantity),
        currency: 'USD',
      }));

      // Add shipping as a line item
      shoppingItems.push({
        productName: 'Shipping',
        productDescription: `${checkoutData.shipping.name} (${checkoutData.shipping.days})`,
        priceInCents: BigInt(checkoutData.shipping.basePrice + checkoutData.shipping.itemPrice * (items.length - 1)),
        quantity: BigInt(1),
        currency: 'USD',
      });

      const session = await createCheckoutSession.mutateAsync(shoppingItems);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to proceed to secure payment with Stripe.
            </p>
            <Button
              onClick={handlePayment}
              disabled={createCheckoutSession.isPending}
              className="w-full"
              size="lg"
            >
              {createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with Stripe'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
