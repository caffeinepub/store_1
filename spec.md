# SKR Lab

## Current State
- Full streetwear e-commerce platform with Motoko backend and React/TypeScript frontend
- Product catalog with categories, sizes, colors, multiple images
- Cart with localStorage persistence (URL-only image serialization to avoid BigInt/method issues)
- Stripe checkout integration (direct redirect, no custom form)
- Admin dashboard with product/category management, featured toggle, hero section, social links, newsletter, contact forms, Stripe config
- Product type has: id, name, description, price, images, sizes, colors, categoryId, weight, order, featured
- No product availability state (products are always visible and purchasable)
- No announcement banner system
- No cart upsell / "You might also like" section
- No lava lamp / animated background on shop page

## Requested Changes (Diff)

### Add
- **Product availability field** on the Product type: a `status` field with three values — `#available`, `#soldOut`, `#hidden`
- **`setProductStatus` backend API** — admin sets per-product availability status
- **Announcement banner system** — `AnnouncementBanner` type with `message: Text` and `enabled: Bool`; `setAnnouncementBanner` (admin) and `getAnnouncementBanner` (public) APIs
- **Announcement banner UI** — dismissible-by-admin-only top bar displayed site-wide above the nav, with placeholder text "Free worldwide shipping on orders over $75"
- **Admin announcement banner management page/section** — toggle on/off + edit message text
- **Cart upsell section** on CartPage — "You might also like" showing 2-3 random available products NOT already in the cart
- **Lava lamp animated background** on ShopPage only — subtle slow-moving electric blue blobs at low opacity behind the product grid

### Modify
- **Product type** — add `status` field (variant: available / soldOut / hidden)
- **Admin products page** — add availability status selector per product (Available / Sold Out / Hidden) in addition to existing featured toggle
- **ShopPage** — filter out `#hidden` products from display; show "Sold Out" badge on `#soldOut` products and disable "Add to Cart"; add lava lamp canvas/CSS animation background
- **ProductDetailPage** — respect `#hidden` (redirect or show not found); show "Sold Out" and disable add to cart for `#soldOut`
- **CartPage** — add "You might also like" upsell section at bottom
- **Backend `reorderProducts` and `updateProduct`** — preserve new `status` field
- **AdminDashboardPage** — add Announcement Banner card linking to banner management

### Remove
- Nothing removed

## Implementation Plan

1. **Backend**: Add `status` variant type to Product (`#available | #soldOut | #hidden`). Add `setProductStatus` API. Add `AnnouncementBanner` type, `setAnnouncementBanner` (admin), `getAnnouncementBanner` (public) APIs. Update all Product record constructions (reorderProducts, setProductFeatured) to carry `status` field through.

2. **Frontend - Product availability**:
   - Update Product type usage to include `status`
   - Admin products page: add a 3-state status selector (Available / Sold Out / Hidden) per product card
   - ShopPage: filter hidden products, show Sold Out badge + disabled cart button for soldOut
   - ProductDetailPage: handle soldOut and hidden states

3. **Frontend - Announcement banner**:
   - Fetch `getAnnouncementBanner` on app load
   - Render a fixed top bar with the message when `enabled: true`, always visible until admin disables it
   - Add admin page/section for banner management (toggle + text edit)
   - Link from AdminDashboardPage

4. **Frontend - Cart upsell**:
   - On CartPage, fetch all products, exclude those already in cart, pick 2-3 random available ones
   - Render as a horizontal product card strip with "You might also like" heading

5. **Frontend - Lava lamp background**:
   - On ShopPage only, render an absolutely positioned canvas or CSS blob animation behind the product grid
   - Electric blue (#3B82F6 / oklch equivalent), very low opacity (0.08–0.12), slow movement (20-40s cycle)
   - Uses requestAnimationFrame or CSS keyframes — no external library needed
