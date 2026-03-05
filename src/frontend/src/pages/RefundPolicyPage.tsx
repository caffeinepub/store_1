export default function RefundPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">No Refunds</h2>
          <p className="text-muted-foreground">
            All sales are final. SKR Lab does not offer refunds on any
            purchases. This policy exists because every product is custom-made
            on demand specifically for your order. Once payment is confirmed,
            production begins and cancellations are not possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Print-on-Demand Model</h2>
          <p className="text-muted-foreground">
            Our products are manufactured individually through Printify's
            print-on-demand network. Because each item is produced for a
            specific order, we cannot cancel, modify, or refund orders once they
            are placed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Defective Products</h2>
          <p className="text-muted-foreground">
            If you receive a defective or damaged product, please contact us
            through our contact form within 7 days of delivery. Include your
            order reference number and photos of the issue. We will review each
            case individually and may offer a replacement at our sole
            discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Order Accuracy</h2>
          <p className="text-muted-foreground">
            Please carefully review your order — including product, size, color,
            and shipping address — before completing your purchase. SKR Lab is
            not responsible for orders placed with incorrect information
            provided by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-muted-foreground">
            For questions about this Refund Policy or to report a defective
            product, please use our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
