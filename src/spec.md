# Specification

## Summary
**Goal:** Remove customer accounts, enable admin customization of homepage hero and social links, and redesign shop navigation with pill-style category filters.

**Planned changes:**
- Remove all customer account functionality (ProfileSetupModal, useUserProfile hook, account/order history pages for non-admin users)
- Implement first-user-becomes-admin authentication with Internet Identity
- Update Privacy Policy and Terms of Service to remove customer account references
- Add admin dashboard fields for customizable homepage hero image, headline, and tagline
- Add admin dashboard fields for editable social media URLs (YouTube, Instagram, TikTok, Twitch, Kick)
- Remove hover dropdown from Shop navigation link in header
- Replace shop page category dropdown with horizontal pill-style buttons using electric blue accent color

**User-visible outcome:** Customers can only checkout as guests through Stripe without creating accounts. The first admin can customize the homepage hero section (image, headline, tagline) and footer social media links through the admin dashboard. The shop page features a visually pleasing horizontal pill-style category filter instead of a dropdown.
