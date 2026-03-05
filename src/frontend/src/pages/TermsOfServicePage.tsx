export default function TermsOfServicePage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            By accessing and using SKR Lab ("the store") and purchasing
            products, you accept and agree to be bound by these terms. SKR Lab
            is operated by sKr_eC as an individual.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Age Requirement</h2>
          <p className="text-muted-foreground">
            You must be at least 13 years old to use our services. If you are
            under 18, you must have express parental or guardian permission to
            make purchases. By completing a purchase, you confirm that you meet
            this age requirement or have obtained parental consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Final Sale Policy</h2>
          <p className="text-muted-foreground">
            All sales are final. SKR Lab does not accept returns or exchanges
            under any circumstances. Due to the custom print-on-demand nature of
            our products, each item is made specifically for your order. Please
            review your order carefully — including product, size, color, and
            shipping address — before completing your purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Product Descriptions
          </h2>
          <p className="text-muted-foreground">
            We strive to provide accurate product descriptions and images.
            Colors may vary slightly due to screen calibration and printing
            processes. We do not warrant that product descriptions are
            completely error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Pricing and Payment
          </h2>
          <p className="text-muted-foreground">
            All prices are in USD and are subject to change without notice.
            Payment is processed securely through Stripe. You agree to provide
            accurate and complete purchase information for all transactions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Guest Checkout</h2>
          <p className="text-muted-foreground">
            SKR Lab operates on a guest checkout basis. No customer accounts are
            created or required. Order confirmation and tracking are
            communicated via the email address you provide at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Shipping</h2>
          <p className="text-muted-foreground">
            Shipping times and costs vary by destination. International
            customers are responsible for any applicable customs duties, import
            taxes, or fees. Please refer to our Shipping &amp; Returns page for
            detailed information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            SKR Lab and sKr_eC are not liable for any indirect, incidental,
            special, or consequential damages arising from your use of this
            website or our products. Our total liability shall not exceed the
            amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please reach out through
            our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
