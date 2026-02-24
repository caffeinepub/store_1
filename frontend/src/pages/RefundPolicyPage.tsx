export default function RefundPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">No Refunds Policy</h2>
          <p className="text-muted-foreground">
            All sales are final. [Business Name] does not offer refunds on any purchases. This policy is in place due to the custom print-on-demand nature of our products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Print-on-Demand Model</h2>
          <p className="text-muted-foreground">
            Our products are made to order specifically for you. Once an order is placed, production begins immediately, and we cannot cancel or modify orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Defective Products</h2>
          <p className="text-muted-foreground">
            If you receive a defective or damaged product, please contact us at [Support Email] within 7 days of delivery. We will review your case on an individual basis and may offer a replacement at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Order Accuracy</h2>
          <p className="text-muted-foreground">
            Please review your order carefully before completing your purchase, including product details, size, color, and shipping address. We are not responsible for orders placed with incorrect information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            For questions about this Refund Policy or to report a defective product, please contact us at [Support Email].
          </p>
        </section>
      </div>
    </div>
  );
}
