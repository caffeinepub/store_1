import { useGetAllOrders } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnalyticsPage() {
  const { data: orders = [] } = useGetAllOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalCosts = orders.reduce((sum, order) => sum + Number(order.printifyCost || 0), 0);
  const profit = totalRevenue - totalCosts;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">${(totalRevenue / 100).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(totalCosts / 100).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">${(profit / 100).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
