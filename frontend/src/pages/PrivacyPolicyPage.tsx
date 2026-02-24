export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide when making a purchase, including name, email address, and shipping address. This information is necessary to process and fulfill your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to process your orders, communicate with you about your purchases, send shipping updates, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Payment Processing</h2>
          <p className="text-muted-foreground">
            Payment information is processed securely through Stripe, our payment processor. We do not store your complete payment card information on our servers. Stripe maintains PCI-DSS compliance to ensure your payment data is handled securely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Newsletter</h2>
          <p className="text-muted-foreground">
            If you subscribe to our newsletter, we will store your email address to send you updates about new products, exclusive drops, and promotions. You can unsubscribe at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Admin Authentication</h2>
          <p className="text-muted-foreground">
            Our website administrators use Internet Identity for secure, privacy-preserving authentication to access the admin dashboard. This authentication system is only used for administrative purposes and does not affect customer checkout or data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but strive to use commercially acceptable means to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your order information for as long as necessary to fulfill orders, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy or how we handle your data, please contact us through our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
