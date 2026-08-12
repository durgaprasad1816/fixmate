# FixMate Java 26 build fix

This build is configured for Java 26.

## Fixes in this version
- Explicitly pins Lombok 1.18.46.
- Configures Lombok as a Maven annotation processor (required for JDK 23+).
- Updates Spring Security 7 `DaoAuthenticationProvider` construction to pass `UserDetailsService` via the constructor.
- Retains the existing production security hardening.

## Verify on Windows
cd F:\fixmate\backend
mvn clean test

Then:
mvn spring-boot:run -Dspring-boot.run.profiles=dev
