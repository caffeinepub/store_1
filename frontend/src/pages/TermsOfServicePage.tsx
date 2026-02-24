export default function TermsOfServicePage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using this website and purchasing products, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Age Requirement</h2>
          <p className="text-muted-foreground">
            You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian permission to make purchases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Final Sale Policy</h2>
          <p className="text-muted-foreground">
            All sales are final. We do not accept returns or exchanges. Due to the custom print-on-demand nature of our products, all purchases are considered final once the order is placed. Please review your order carefully before completing your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Product Descriptions</h2>
          <p className="text-muted-foreground">
            We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Colors may vary slightly due to screen settings and printing processes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Pricing and Payment</h2>
          <p className="text-muted-foreground">
            All prices are in USD and are subject to change without notice. We reserve the right to modify prices at any time. Payment is processed securely through Stripe. You agree to provide current, complete, and accurate purchase information for all transactions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Order Processing</h2>
          <p className="text-muted-foreground">
            Orders are processed as guest checkouts. You do not need to create an account to make a purchase. Once your order is placed and payment is confirmed, we will begin processing your order for fulfillment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Shipping</h2>
          <p className="text-muted-foreground">
            Shipping times and costs vary by destination. Please refer to our Shipping & Returns page for detailed information about shipping options and estimated delivery times.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please contact us through our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
