import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminNewsletterPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Newsletter Subscribers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Newsletter management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
