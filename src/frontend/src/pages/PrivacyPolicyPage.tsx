export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 2026
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            SKR Lab collects information you provide when making a purchase,
            including your name, email address, shipping address, billing
            address, and phone number. This information is used solely to
            process and fulfill your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground">
            We use your information to process orders, communicate order status,
            and fulfill shipments. We do not sell, rent, or share your personal
            information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Payment Processing</h2>
          <p className="text-muted-foreground">
            Payment information is processed securely by Stripe. When you check
            out, Stripe receives your name, email address, shipping address,
            billing address, phone number, and payment card details in order to
            complete your purchase. SKR Lab does not store your complete payment
            card information. Stripe maintains PCI-DSS compliance to ensure your
            payment data is handled securely. Stripe&apos;s handling of your
            data is governed by their{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Newsletter</h2>
          <p className="text-muted-foreground">
            If you subscribe to our newsletter, your email address is stored to
            send you updates about new products and exclusive drops. You can
            unsubscribe at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate security measures to protect your personal
            information. The store is hosted on the Internet Computer, a
            decentralized blockchain network. No method of transmission over the
            internet is 100% secure, but we strive to use commercially
            reasonable measures to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain order information as long as necessary to fulfill orders
            and comply with applicable legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy or how we handle
            your data, please contact us through our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
