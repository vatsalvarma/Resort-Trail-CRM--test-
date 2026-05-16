# ── Build Stage ───────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# ── Runtime Stage ─────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S crm && adduser -S crm -G crm
COPY --from=build /app/target/*.jar app.jar
RUN chown crm:crm app.jar
USER crm
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
