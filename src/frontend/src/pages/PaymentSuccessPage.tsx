import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    sessionStorage.removeItem('checkoutData');
  }, [clearCart]);

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Thank you for your purchase! We've received your order and will process it shortly.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll receive tracking information via email once your order ships.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/">
                <Button className="w-full">Back to Home</Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
