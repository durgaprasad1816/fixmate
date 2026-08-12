# FixMate Premium Frontend Update

## What changed
- Premium responsive landing page with repair/service image slider.
- Desktop navigation plus mobile hamburger navigation.
- Customer-only public registration; provider self-registration is removed from the UI.
- Provider onboarding is admin-controlled from the Admin > Providers screen.
- Added About / business onboarding section for service providers.
- Customer service browsing now shows verified providers only.
- Booking confirmation requires service address, map coordinates and scheduled date/time.
- Browser geolocation can populate the booking coordinates; a Google Maps link is provided for the selected location.
- Provider booking screen shows customer name, phone, address, scheduled time and map navigation.
- Booking status changes continue to generate backend notifications.
- Customer notification page polls for updates and surfaces a rating action after completion.
- Customer bookings show the visit map and existing rating workflow.
- Admin provider creation calls the new protected `POST /api/admin/providers` endpoint.

## Important production note
The current backend notification system is in-app. Real SMS/WhatsApp/push-to-phone delivery after completion requires a messaging/push provider and production credentials; this update does not invent those credentials.

## Run
Frontend:
```powershell
cd F:\fixmate\frontend
npm install
npm run dev
```

Backend:
```powershell
cd F:\fixmate\backend
& "F:\Maven\apache-maven-3.9.16\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.profiles=dev"
```
