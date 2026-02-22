import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProductsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
