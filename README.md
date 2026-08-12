# FixMate

A multi-service booking platform that brings your friends' different trades — AC repair,
plastic welding, electrical work, plumbing, and any others you add later — into one app.
Customers browse and book verified providers, track their order status in real time, and
leave ratings & reviews. Providers manage their own bookings and see their track record.
Admin controls everything: adding new occupations, approving providers, and monitoring
all activity across the platform.

```
fixmate/
├── backend/     Spring Boot (Java) REST API + MySQL
├── frontend/    React (Vite) web app
└── database/    Notes on the auto-generated DB schema
```

## Who can do what

| Role      | Can do |
|-----------|--------|
| **Customer** | Register, browse occupations & providers, book a service, track order status, cancel, rate & review, see notifications |
| **Provider** | Register under an occupation (awaits admin approval), view/accept/reject bookings, update job status, see track record & reviews, notifications |
| **Admin**    | Add/manage occupations, approve/block providers, view all bookings, view/deactivate customers, dashboard stats |

Customers can never reach `/admin`, and vice versa — each role has its own JWT and its own
protected area of the app, both on the backend (Spring Security) and frontend (route guards).

---

## 1. Backend setup (Spring Boot)

### Requirements
- Java 26 (`java -version`)
- Maven (or just use your IDE's built-in Maven — IntelliJ/Eclipse/VS Code all bundle one)
- MySQL 8+ running locally (XAMPP's MySQL works fine)

### Steps
1. **Create the database.** Open phpMyAdmin or the MySQL CLI and run:
   ```sql
   CREATE DATABASE fixmate_db;
   ```
   (Or just start the app — `createDatabaseIfNotExist=true` is already set in the JDBC URL,
   so it'll create it for you as long as your MySQL user has permission.)

2. **Set your DB credentials.** Open `backend/src/main/resources/application.properties`
   and update:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
   (XAMPP's default is username `root`, empty password — already set as the default.)

3. **Run it.**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Or open the folder in IntelliJ/Eclipse/VS Code and run `FixmateApplication.java` directly.

4. The API starts on **http://localhost:8080**. On first run it automatically creates:
   - A default **admin** account: `admin@fixmate.com` / `Admin@123` — **change this password
     in `application.properties` before you go live.**
   - Four starter occupations: AC Repair & Services, Plastic Welding, Electrical Work, Plumbing.

   Tables are created automatically (Hibernate `ddl-auto=update`) — no manual SQL needed.

### Adding a new occupation later
Log in as admin → **Occupations** tab → "+ Add Occupation". No code changes, no redeploy.
That's the mechanism that satisfies "admin can add another occupation or type of work."

---

## 2. Frontend setup (React)

### Requirements
- Node.js 18+ and npm

### Steps
```bash
cd frontend
npm install
npm run dev
```
Opens at **http://localhost:5173**. It talks to the backend at `http://localhost:8080` by
default — copy `.env.example` to `.env` and change `VITE_API_BASE_URL` if you deploy the
backend elsewhere.

### Building for production
```bash
npm run build
```
Outputs static files to `frontend/dist/` — deploy that folder to any static host (Netlify,
Vercel, an Nginx server, etc.), pointed at your live backend URL via `.env`.

---

## 3. Trying it out end-to-end

1. Start backend, start frontend.
2. Go to `http://localhost:5173` → **Become a Provider** → register one of your friends
   (pick their occupation, e.g. AC Repair).
3. Log in as admin (`admin@fixmate.com` / `Admin@123`) → **Providers** tab → **Approve** them.
4. Register a second account as a **Customer** → browse **AC Repair** → book that provider.
5. Log back in as the provider → **My Bookings** → Accept → Start Work → Mark Completed.
6. Log back in as the customer → **My Bookings** → Track Order (see the full status timeline)
   → Rate & Review.
7. Log in as admin → **Overview** tab to see live stats, or **All Bookings** for the full
   track record.

---

## 4. Deploying with Docker (recommended for real-world use)

The project now ships with Docker files for all three pieces (MySQL, backend, frontend),
so you can bring the whole stack up with one command on any server that has Docker installed
— no manually installing Java, Node, or MySQL on the machine you deploy to.

```bash
cp .env.example .env
# edit .env: set a real DB_PASSWORD, JWT_SECRET, and ADMIN_PASSWORD
docker compose up -d --build
```

- Frontend: `http://<your-server>:80`
- Backend API: `http://<your-server>:8080`
- MySQL data persists in a Docker volume (`fixmate_mysql_data`) across restarts/redeploys.

To update after a code change: `docker compose up -d --build` again — it rebuilds only
what changed. To stop everything: `docker compose down` (add `-v` only if you also want
to wipe the database).

**Where to run this:** any VPS works (DigitalOcean, Hetzner, a $6/mo Linode, AWS Lightsail,
etc.) — install Docker + Docker Compose on it, copy this project over (`git clone` or `scp`),
then run the two commands above. Point your domain's DNS at the server's IP once it's up.

### What's already handled for production
- All secrets (DB password, JWT secret, admin password, CORS origins) come from environment
  variables, not hardcoded in the repo — set the real ones in your `.env` file, which is
  git-ignored by default.
- `/actuator/health` is exposed (unauthenticated) for uptime monitors or a load balancer's
  health check, without exposing any other internals.
- Passwords now require a minimum length and phone numbers are validated server-side.

### Still worth doing before your friends' customers rely on this
- **Put HTTPS in front of it.** The simplest route: point a domain at your server, run
  [Caddy](https://caddyserver.com/) or Nginx + Certbot in front of the `frontend`/`backend`
  containers for automatic free SSL. Docker Compose here intentionally stays HTTP-only
  so it's portable — TLS termination is a reverse-proxy's job, not the app's.
- **Rotate the JWT secret and admin password** in your `.env` to something long and random
  (`openssl rand -base64 48` for the JWT secret) — don't ship with the example values.
- **Back up the MySQL volume regularly** (`docker exec fixmate-mysql mysqldump ...` on a cron,
  or your VPS provider's snapshot feature).
- Consider adding payments, push notifications, and photo uploads (before/after job photos)
  as natural next features — the booking/status model here is built to extend easily.

## 4b. Deploying without Docker

Still fully supported — follow sections 1 and 2 above on your server directly (install
Java 26 + MySQL for the backend, Node.js to build the frontend, then serve `frontend/dist`
with any static file server or Nginx). Just remember to set the same environment variables
described in `.env.example` on that machine instead of relying on the local defaults.

---

## API quick reference

Base URL: `http://localhost:8080`

| Method | Endpoint | Who |
|---|---|---|
| POST | `/api/auth/register/customer` | Public |
| POST | `/api/auth/register/provider` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/public/categories` | Public |
| GET  | `/api/public/categories/{id}/providers` | Public |
| POST | `/api/customer/bookings` | Customer |
| GET  | `/api/customer/bookings` | Customer |
| GET  | `/api/customer/bookings/{id}/track` | Customer |
| PUT  | `/api/customer/bookings/{id}/cancel` | Customer |
| POST | `/api/customer/reviews` | Customer |
| GET  | `/api/customer/notifications` | Customer |
| GET  | `/api/provider/profile` | Provider |
| GET  | `/api/provider/bookings` | Provider |
| PUT  | `/api/provider/bookings/{id}/status` | Provider |
| GET  | `/api/provider/stats` | Provider |
| GET  | `/api/provider/reviews` | Provider |
| GET  | `/api/provider/notifications` | Provider |
| POST | `/api/admin/categories` | Admin |
| GET  | `/api/admin/categories` | Admin |
| PUT  | `/api/admin/categories/{id}/toggle-active` | Admin |
| GET  | `/api/admin/providers` | Admin |
| PUT  | `/api/admin/providers/{id}/verify` | Admin |
| GET  | `/api/admin/customers` | Admin |
| PUT  | `/api/admin/customers/{id}/toggle-active` | Admin |
| GET  | `/api/admin/bookings` | Admin |
| GET  | `/api/admin/stats` | Admin |

All non-public endpoints require an `Authorization: Bearer <token>` header, using the
token returned from `/api/auth/login`.
