# Specification

## Summary
**Goal:** Fix the admin bootstrap flow so that the first authenticated user is automatically and permanently assigned admin rights, and the frontend reflects this without showing an access denied message.

**Planned changes:**
- Update backend admin initialization logic so that if no admin exists in stable storage, the first authenticated caller to invoke `isCallerAdmin` or any admin-gated function is automatically stored as a permanent admin, persisting across canister upgrades
- Update the frontend `AdminDashboardPage` to re-evaluate the admin check immediately after a successful Internet Identity login, ensuring the bootstrapped admin sees the dashboard without an access denied message

**User-visible outcome:** The first user to log in via Internet Identity is automatically granted admin access and immediately sees the admin dashboard without any access denied errors. All subsequent non-admin users continue to receive access denied as expected.
