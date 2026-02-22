import { useGetAllOrders } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

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
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p>{order.shippingAddress.name}</p>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
