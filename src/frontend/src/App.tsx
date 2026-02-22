import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminNewsletterPage from './pages/AdminNewsletterPage';
import AdminContactFormsPage from './pages/AdminContactFormsPage';
import AdminHeroSectionPage from './pages/AdminHeroSectionPage';
import AdminSocialLinksPage from './pages/AdminSocialLinksPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: AdminProductsPage,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: AdminCategoriesPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: AdminOrdersPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/analytics',
  component: AdminAnalyticsPage,
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/newsletter',
  component: AdminNewsletterPage,
});

const adminContactFormsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contact-forms',
  component: AdminContactFormsPage,
});

const adminHeroSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/hero-section',
  component: AdminHeroSectionPage,
});

const adminSocialLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/social-links',
  component: AdminSocialLinksPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsOfServicePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicyPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shipping',
  component: ShippingReturnsPage,
});

const refundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/refund',
  component: RefundPolicyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  contactRoute,
  cartRoute,
  checkoutRoute,
  paymentRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute,
  adminProductsRoute,
  adminCategoriesRoute,
  adminOrdersRoute,
  adminAnalyticsRoute,
  adminNewsletterRoute,
  adminContactFormsRoute,
  adminHeroSectionRoute,
  adminSocialLinksRoute,
  termsRoute,
  privacyRoute,
  shippingRoute,
  refundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
