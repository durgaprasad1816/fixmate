# FixMate validation

This package includes source-level security and production hardening fixes.

## Fixed
- Customer booking tracking now checks booking ownership.
- Admin customer APIs return `UserResponse` DTOs and never serialize password hashes.
- Provider/category mismatch is rejected when creating a booking.
- Generic 500 responses no longer expose internal exception messages; details are logged server-side.
- Admin seed password is never logged.
- Production JWT/admin secrets have no hard-coded fallback values.
- Admin seeding is explicitly configurable and can be disabled after bootstrap.
- Admin statistics use database count queries instead of loading every booking.
- Security headers were added.
- Nginx proxies `/api` privately to the backend.
- MySQL is no longer published to the host in Docker Compose.
- Backend Docker image runs as a non-root user.
- Vite development proxy and production same-origin API routing are configured.

## Environment limitation
A full Maven build could not be executed in the provided environment because Maven is not installed. A frontend `npm ci` was attempted, but the environment's package registry returned HTTP 404 for the pinned Vite package. Therefore this ZIP has not been claimed as a successfully compiled build in this environment.

Run these on a machine with Java 26, Maven, and Node.js:

```bash
cd backend
mvn clean test
mvn clean package

cd ../frontend
npm ci
npm run build
```

For local development:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

and:

```bash
cd frontend
npm install
npm run dev
```
