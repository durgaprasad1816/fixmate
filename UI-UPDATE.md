# FixMate UI update

- Added the supplied FixMate logo as `frontend/public/fixmate-logo.png`.
- Added a 32x32 PNG favicon and Apple touch icon.
- Added separate `/login/customer`, `/login/provider`, and `/login/admin` portals.
- Protected customer/provider/admin routes now redirect to their own login portal.
- Provider dashboard child pages have loading/error states to prevent blank white screens.
- Admin provider management now supports edit and permanent delete.

## Permanent provider deletion
Deleting a provider removes the provider account, profile, notifications, reviews, bookings and booking status history in one transaction. This is intentionally irreversible.
