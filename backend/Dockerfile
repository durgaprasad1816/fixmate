FROM maven:3.9-eclipse-temurin-26 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:26-jre-jammy
WORKDIR /app
RUN useradd --system --create-home --uid 10001 fixmate
COPY --from=build --chown=fixmate:fixmate /app/target/fixmate-backend-*.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
