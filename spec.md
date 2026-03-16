# SKR Lab

## Current State
- Product type has: id, name, description, price, images, sizes, colors, categoryId, weight, order, featured, status
- ProductDetailPage shows description inline, no tabs, no size guide, no recommendations
- ProductForm has a color input with key `color-${index}-${color}` causing focus loss on each keystroke
- stripe.mo has a country index bug: all countries get index [0], overwriting each other; also missing billing_address_collection and phone_number_collection
- CartPage: Continue Shopping and Checkout buttons lack sufficient spacing
- PrivacyPolicyPage: does not mention phone number collection or Stripe as data processor

## Requested Changes (Diff)

### Add
- `bulletPoints: [Text]` field to Product type (backend + frontend types)
- Bullet points editor in ProductForm (unlimited add/remove)
- Details tab on ProductDetailPage showing description + bullet points
- "Size Guide" underlined link on ProductDetailPage opening a modal
- SizeGuideModal component with S-XXL sizing table in both inches and cm
- "You might also like" recommendations section on ProductDetailPage (3-4 same-category products)
- `billing_address_collection=required` and `phone_number_collection[enabled]=true` in Stripe checkout session
- Comprehensive hardcoded country list for `shipping_address_collection` with fixed incrementing index

### Modify
- stripe.mo: fix country index bug, add billing + phone params, move shipping params before line items
- main.mo: pass comprehensive country list to Stripe; add bulletPoints to Product type and all record constructions
- backend.d.ts: add bulletPoints to Product interface
- ProductForm.tsx: fix color input key to index-only (fix focus bug); add bullet points field
- ProductDetailPage.tsx: add Details tab, size guide link, product recommendations
- CartPage.tsx: add gap between Continue Shopping and Checkout buttons
- PrivacyPolicyPage.tsx: update section 1 to include phone number; update section 3 to name Stripe as data processor receiving customer data

### Remove
- Nothing

## Implementation Plan
1. Update main.mo: add bulletPoints to Product type and all constructions; pass comprehensive country list to Stripe
2. Update stripe.mo: fix country index, add billing_address_collection and phone_number_collection, move params before line items
3. Update backend.d.ts: add bulletPoints field
4. Update ProductForm.tsx: fix color key, add bullet points UI
5. Update ProductDetailPage.tsx: Details tab, size guide link, recommendations
6. Add SizeGuideModal.tsx component
7. Fix CartPage.tsx button spacing
8. Update PrivacyPolicyPage.tsx
