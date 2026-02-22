import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCategoriesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Category management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
