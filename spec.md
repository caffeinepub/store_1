# SKR Lab

## Current State

Full-stack streetwear e-commerce platform with:
- Product catalog, cart, and multi-step checkout (cart → /checkout form → /payment → Stripe)
- Checkout form collects: full name, email, street, city, state, zip, country, and shipping method selection
- Payment page reads checkoutData from sessionStorage and creates a Stripe session with cart items + shipping line item
- Admin dashboard with cards for: Products, Categories, Orders, Analytics, Hero Section, Social Links, Newsletter, Contact Forms
- Admin orders pages (list + detail) with status tracking and per-order cost tracking
- Admin analytics page showing total revenue, costs, profit
- Hero section admin: headline + tagline (both required), optional image
- HomePage: hero with tagline directly above "Shop Now" button with tight spacing
- No Stripe configuration UI in admin dashboard

## Requested Changes (Diff)

### Add
- Stripe Configuration card in admin dashboard linking to a new `/admin/stripe` page
- `/admin/stripe` page: form to enter Stripe secret key + allowed countries, save via `setStripeConfiguration`

### Modify
- **Checkout flow**: Remove `/checkout` form page and `/payment` intermediate page entirely. Cart "Proceed to Checkout" button goes directly to Stripe via `createCheckoutSession`. Shipping options shown on cart page for region selection before going to Stripe, OR simplify to just send cart items to Stripe with a single shipping line item at a fixed rate — simplest: remove shipping pre-selection, let Stripe handle address, show cart items and a "Pay with Stripe" button directly on the cart summary or a minimal confirm page.
- **Actually**: Replace the entire checkout flow with: Cart → minimal confirm page (shows items, total without shipping, note that shipping calculated at checkout) → Stripe. No address form. No CheckoutPage. No PaymentPage collecting address. The createCheckoutSession still passes all cart items as ShoppingItems.
- **PaymentPage**: Repurpose as a simple "Review & Pay" confirm page — shows cart items with size/color, subtotal, and a single "Pay with Stripe" button. No form fields. Goes directly to Stripe.
- **CheckoutPage**: Remove entirely (no longer needed). Cart's "Proceed to Checkout" button goes to /payment (the confirm page).
- **Admin dashboard**: Remove Orders card and Analytics card
- **Admin orders/analytics pages**: Keep files but remove routes and nav links (or redirect to admin)
- **Hero Section admin**: Make tagline optional — remove required validation, allow empty string, update `handleSubmit` to not require tagline
- **HomePage**: Increase spacing between tagline and "Shop Now" button (add more margin/padding between the `<p>` tagline and the `<Link>` button)
- **HeroSection backend type**: tagline is already a Text field — frontend just needs to allow empty

### Remove
- `/checkout` route and CheckoutPage from routing (or repurpose)
- Orders and Analytics cards from AdminDashboardPage
- sessionStorage checkoutData dependency (PaymentPage no longer reads it)

## Implementation Plan

1. **Admin Stripe config page**: Create `AdminStripePage.tsx` with form for secretKey + allowedCountries (comma-separated input), calls `setStripeConfiguration`. Add route `/admin/stripe`. Add Stripe config card to AdminDashboardPage.

2. **Simplify checkout flow**:
   - Remove CheckoutPage form (address collection, shipping method selection)
   - Repurpose PaymentPage as a "Review & Pay" page: shows cart items (name, size, color, quantity, price), subtotal note about shipping at Stripe, and "Pay with Stripe" button
   - Update CartPage: "Proceed to Checkout" → navigates to `/payment`
   - PaymentPage calls `createCheckoutSession` with cart items only (no shipping line item since address/shipping handled by Stripe)
   - Remove `/checkout` route from App.tsx

3. **Admin dashboard cleanup**: Remove Orders and Analytics link cards from AdminDashboardPage. Keep the page files but remove their routes from App.tsx.

4. **Hero section tagline optional**:
   - `AdminHeroSectionPage.tsx`: remove tagline from required field validation, allow saving with empty tagline
   - `HomePage.tsx`: only render the tagline `<p>` if tagline is non-empty; increase spacing/margin between tagline (or headline) and the Shop Now button

5. **HomePage spacing**: Change `space-y-8` to `space-y-12` or add explicit `mt-8` to the Shop Now button link.
