# SKR Lab

## Current State
- stripe.mo builds checkout session body but uses `[0]` index for every country in `shipping_address_collection[allowed_countries]`, so only the last country survives
- `billing_address_collection` and `phone_number_collection` parameters are missing from the checkout session request
- PaymentPage.tsx shows an awkward text disclaimer about data collection instead of a Stripe badge
- Footer.tsx has no Stripe trust badge

## Requested Changes (Diff)

### Add
- "Secured by Stripe" badge with lock icon above the checkout button on PaymentPage
- "Payments secured by Stripe" trust line with Stripe wordmark in footer
- `billing_address_collection=required` param to Stripe checkout session body
- `phone_number_collection[enabled]=true` param to Stripe checkout session body

### Modify
- Fix country index in `buildCheckoutSessionBody` to increment properly (`[0]`, `[1]`, `[2]`...)
- Replace the text disclaimer on PaymentPage with a Stripe badge

### Remove
- The verbose text disclaimer on PaymentPage ("You'll complete your purchase on Stripe's secure checkout page...")

## Implementation Plan
1. Fix `stripe.mo`: increment country index, add billing address and phone collection params
2. Update `PaymentPage.tsx`: replace text with clean Stripe badge
3. Update `Footer.tsx`: add Stripe trust badge at bottom
