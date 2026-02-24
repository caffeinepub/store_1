import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder, useUpdateOrderStatus, useUpdateOrderCost } from '../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams({ from: '/admin/orders/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const updateCost = useUpdateOrderCost();

  const [status, setStatus] = useState('');
  const [costInput, setCostInput] = useState('');

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Order not found</p>
            <Button onClick={() => navigate({ to: '/admin/orders' })} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopyToClipboard = () => {
    const printifyData = `
ORDER: ${order.id}
DATE: ${new Date(Number(order.timestamp) / 1000000).toLocaleString()}

CUSTOMER INFORMATION:
Name: ${order.shippingAddress.name}
Street: ${order.shippingAddress.street}
City: ${order.shippingAddress.city}
State: ${order.shippingAddress.state}
ZIP: ${order.shippingAddress.zip}
Country: ${order.shippingAddress.country}

SHIPPING METHOD:
${order.shippingOption.name}

PRODUCTS:
${order.products
  .map(
    (p, i) => `
${i + 1}. ${p.name}
   SKU: ${p.id}
   Size: ${p.sizes.join(', ')}
   Colors: ${p.colors.join(', ')}
   Quantity: 1
`
  )
  .join('\n')}

TOTAL: $${(Number(order.total) / 100).toFixed(2)}
    `.trim();

    navigator.clipboard.writeText(printifyData);
    toast.success('Order details copied to clipboard');
  };

  const handleUpdateStatus = async () => {
    if (!status) return;

    try {
      await updateStatus.mutateAsync({ orderId: order.id, status });
      toast.success('Order status updated');
      setStatus('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleUpdateCost = async () => {
    if (!costInput) return;

    const costInCents = Math.round(parseFloat(costInput) * 100);
    if (isNaN(costInCents) || costInCents < 0) {
      toast.error('Please enter a valid cost');
      return;
    }

    try {
      await updateCost.mutateAsync({ orderId: order.id, cost: BigInt(costInCents) });
      toast.success('Printify cost updated');
      setCostInput('');
    } catch (error) {
      console.error('Error updating cost:', error);
      toast.error('Failed to update cost');
    }
  };

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/orders' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{order.id}</h1>
        <Button onClick={handleCopyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy for Printify
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.shippingAddress.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{order.shippingAddress.street}</p>
              <p className="font-medium">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="font-medium">{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(Number(order.timestamp) / 1000000).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipping Method</p>
              <p className="font-medium">{order.shippingOption.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium text-lg">${(Number(order.total) / 100).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.sizes.join(', ')}</TableCell>
                  <TableCell>{product.colors.join(', ')}</TableCell>
                  <TableCell className="text-right">${(Number(product.price) / 100).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateStatus} disabled={!status || updateStatus.isPending}>
              {updateStatus.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actual Printify Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.printifyCost && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Current Cost</p>
                <p className="text-2xl font-bold">${(Number(order.printifyCost) / 100).toFixed(2)}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cost">Enter Actual Cost (USD)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <Button onClick={handleUpdateCost} disabled={!costInput || updateCost.isPending}>
              {updateCost.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Cost
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
