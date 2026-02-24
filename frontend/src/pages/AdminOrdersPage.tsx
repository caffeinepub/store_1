import { useGetAllOrders } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Eye, Loader2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">${(Number(order.total) / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p>{order.products.length}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/admin/orders/$orderId', params: { orderId: order.id } })}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
