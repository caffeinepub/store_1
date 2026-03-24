import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import AdminAnnouncementPage from "./pages/AdminAnnouncementPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminContactFormsPage from "./pages/AdminContactFormsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminHeroSectionPage from "./pages/AdminHeroSectionPage";
import AdminNewsletterPage from "./pages/AdminNewsletterPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminSocialLinksPage from "./pages/AdminSocialLinksPage";
import AdminStripePage from "./pages/AdminStripePage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ShippingReturnsPage from "./pages/ShippingReturnsPage";
import ShopPage from "./pages/ShopPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: PaymentPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products",
  component: AdminProductsPage,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/categories",
  component: AdminCategoriesPage,
});

const adminStripeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/stripe",
  component: AdminStripePage,
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/newsletter",
  component: AdminNewsletterPage,
});

const adminContactFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/contact-forms",
  component: AdminContactFormsPage,
});

const adminHeroSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/hero-section",
  component: AdminHeroSectionPage,
});

const adminSocialLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/social-links",
  component: AdminSocialLinksPage,
});

const adminAnnouncementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/announcement",
  component: AdminAnnouncementPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsOfServicePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPolicyPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipping",
  component: ShippingReturnsPage,
});

const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/refund",
  component: RefundPolicyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  contactRoute,
  cartRoute,
  paymentRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute,
  adminProductsRoute,
  adminCategoriesRoute,
  adminStripeRoute,
  adminNewsletterRoute,
  adminContactFormsRoute,
  adminHeroSectionRoute,
  adminSocialLinksRoute,
  adminAnnouncementRoute,
  termsRoute,
  privacyRoute,
  shippingRoute,
  refundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait 700ms then fade in — gives backend calls time to resolve
    // so hero image and text arrive together rather than text flashing in alone
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
    >
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppContent />
    </ThemeProvider>
  );
}
