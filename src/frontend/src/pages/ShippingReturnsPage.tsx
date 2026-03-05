export default function ShippingReturnsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping &amp; Returns</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Shipping Rates &amp; Times
          </h2>

          <h3 className="text-xl font-semibold mb-2 mt-4">United States</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              Economy — 4–8 business days: $3.99 first item + $2.09 each
              additional
            </li>
            <li>
              Standard — 2–5 business days: $4.75 first item + $2.40 each
              additional
            </li>
            <li>
              Express — 2–3 business days: $7.99 first item + $2.40 each
              additional
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            * Shipments to Alaska, Hawaii, Puerto Rico, and unincorporated US
            territories may take an additional 7–12 business days.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Canada</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              Standard — 10–30 business days: $9.39 first item + $4.39 each
              additional
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">Australia</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              Standard — 10–30 business days: $12.49 first item + $4.99 each
              additional
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">Rest of World</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              Standard — 10–30 business days: $10.00 first item + $4.00 each
              additional
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            International Customs &amp; Duties
          </h2>
          <p className="text-muted-foreground">
            International customers are solely responsible for any customs
            duties, import taxes, VAT, or other fees charged by their country
            upon delivery. These charges are not included in your order total
            and are not collected by SKR Lab. SKR Lab is not responsible for
            customs delays, package holds, or additional fees imposed by your
            country's customs authority.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns Policy</h2>
          <p className="text-muted-foreground">
            All sales are final. SKR Lab does not accept returns or exchanges.
            Due to the custom print-on-demand nature of our products, each item
            is produced specifically for your order. Please review your order
            carefully before completing your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Defective or Damaged Items
          </h2>
          <p className="text-muted-foreground">
            If you receive a defective or damaged item, please contact us
            through our contact form within 7 days of delivery and include
            photos of the issue. We will review your case and determine the
            appropriate resolution at our discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
