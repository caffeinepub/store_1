import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Your payment was not completed. This could be due to cancellation or a payment error.
            </p>
            <p className="text-sm text-muted-foreground">
              Your cart items have been preserved. You can try again when you're ready.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/cart">
                <Button className="w-full">Return to Cart</Button>
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
