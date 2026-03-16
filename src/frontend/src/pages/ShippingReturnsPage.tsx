export default function ShippingReturnsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping &amp; Returns</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
          <p className="text-muted-foreground">
            We offer{" "}
            <strong className="text-foreground">free worldwide shipping</strong>{" "}
            on all orders. Estimated delivery times are as follows:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
            <li>United States — 2–8 business days</li>
            <li>Canada — 10–30 business days</li>
            <li>Australia — 10–30 business days</li>
            <li>Rest of World — 10–30 business days</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            * Shipments to Alaska, Hawaii, Puerto Rico, and unincorporated US
            territories may take an additional 7–12 business days.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Delivery times are estimates and not guaranteed. Delays may occur
            due to carrier issues, customs processing, or other factors outside
            our control.
          </p>
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
