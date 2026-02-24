import { useGetContactForms } from '../hooks/useContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContactFormsPage() {
  const { data: forms = [], isLoading } = useGetContactForms();

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Form Submissions</h1>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {forms.map((form, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{form.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{form.email}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{form.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(Number(form.timestamp)).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
