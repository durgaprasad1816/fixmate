# FixMate Profile Menu Update

- Added the supplied 128x128 profile avatar to `public/profile-avatar.png`.
- Added a clickable profile menu to the authenticated navbar for ADMIN, PROVIDER and CUSTOMER.
- Provider profile card loads `/api/provider/profile` and displays business name, owner, category, phone, email, experience, address, bio and verification status.
- Admin/customer cards display account details available from login.
- Added phone to AuthResponse so customer/admin profile cards can display phone after login.
- Public navbar shows only Customer login and Register.
