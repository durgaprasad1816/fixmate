# FixMate Postman checklist

Base URL: `http://localhost:8080`

## Auth
- POST `/api/auth/login` — admin/provider/customer login
- POST `/api/auth/register/customer` — customer registration

## Public
- GET `/api/public/categories`
- GET `/api/public/categories/{categoryId}/providers`

## Admin (Bearer ADMIN token)
- GET `/api/admin/stats`
- GET `/api/admin/providers`
- POST `/api/admin/providers`
- PUT `/api/admin/providers/{id}` — edit provider
- PUT `/api/admin/providers/{id}/verify` — approve/block/unblock
- DELETE `/api/admin/providers/{id}` — permanent provider deletion
- GET `/api/admin/customers`
- PUT `/api/admin/customers/{id}/toggle-active`
- GET `/api/admin/bookings`
- GET `/api/admin/categories`
- POST `/api/admin/categories`
- PUT `/api/admin/categories/{id}`
- PUT `/api/admin/categories/{id}/toggle-active`

## Provider (Bearer PROVIDER token)
- GET `/api/provider/profile`
- GET `/api/provider/bookings`
- PUT `/api/provider/bookings/{id}/status`
- GET `/api/provider/stats`
- GET `/api/provider/reviews`
- GET `/api/provider/notifications`
- PUT `/api/provider/notifications/{id}/read`

## Customer (Bearer CUSTOMER token)
- GET `/api/customer/bookings`
- POST `/api/customer/bookings`
- PUT `/api/customer/bookings/{id}/cancel`
- GET `/api/customer/bookings/{id}/tracking`
- POST `/api/customer/bookings/{id}/review`
- GET `/api/customer/notifications`
- PUT `/api/customer/notifications/{id}/read`

### Required regression test
1. Admin creates provider.
2. Admin edits provider.
3. Admin approves provider.
4. Provider logs in at `/login/provider`.
5. Provider dashboard opens and `/api/provider/profile` returns 200.
6. Customer sees the verified provider.
7. Customer creates a booking.
8. Provider accepts → starts → completes.
9. Customer sees tracking and submits review.
10. Admin permanently deletes provider.
11. Provider login must fail afterwards and provider must no longer appear in admin/public provider lists.
