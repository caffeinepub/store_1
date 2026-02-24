export default function ShippingReturnsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping & Returns Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">United States</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Economy: 4-8 business days</li>
            <li>Standard: 2-5 business days</li>
            <li>Express: 2-3 business days</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">Canada</h3>
          <p className="text-muted-foreground">Standard shipping: 10-30 business days</p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Australia</h3>
          <p className="text-muted-foreground">Standard shipping: 10-30 business days</p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Rest of World</h3>
          <p className="text-muted-foreground">Standard shipping: 10-30 business days</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">International Customs & Duties</h2>
          <p className="text-muted-foreground">
            International customers are responsible for any customs duties, import taxes, or fees charged by their country. These charges are separate from shipping costs and are not included in your order total. [Business Name] is not responsible for any customs delays or additional fees.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns Policy</h2>
          <p className="text-muted-foreground">
            All sales are final. Due to the custom print-on-demand nature of our products, we do not accept returns or exchanges. Please review your order carefully before completing your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Defective Items</h2>
          <p className="text-muted-foreground">
            If you receive a defective or damaged item, please contact us at [Support Email] within 7 days of delivery with photos of the issue. We will review your case and determine the appropriate resolution.
          </p>
        </section>
      </div>
    </div>
  );
}
