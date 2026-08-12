# FixMate production deployment

## 1. Prerequisites
- Docker Engine + Docker Compose
- A real domain and HTTPS reverse proxy/certificate in front of the app for public deployment.

## 2. Configure secrets
Copy `.env.example` to `.env` and replace:
- `DB_PASSWORD`
- `JWT_SECRET`
- `ADMIN_PASSWORD`

Do not commit `.env`.

## 3. First database bootstrap
For the first deployment only, keep:
`ADMIN_SEED_ENABLED=true`

The backend uses `DDL_AUTO=validate`, so the production database schema must exist before the backend starts. Apply `database/schema-notes.sql` or use your migration process.

After confirming the admin account works, set:
`ADMIN_SEED_ENABLED=false`

## 4. Start
`docker compose up -d --build`

The browser reaches the frontend on port 80. Nginx proxies `/api/*` privately to Spring Boot. MySQL is not published to the host.

## 5. Security notes
- Put HTTPS in front of the frontend.
- Keep `.env` private.
- Rotate the JWT secret if it is ever exposed.
- Do not use the `dev` Spring profile in production.
- Keep `DDL_AUTO=validate` in production and manage schema changes with migrations/backups.
- After initial admin bootstrap, disable admin seeding.

## Local development
From `backend`:
`mvn spring-boot:run -Dspring-boot.run.profiles=dev`

From `frontend`:
`npm install`
`npm run dev`

The Vite dev server proxies `/api` to `http://localhost:8080`.
