# Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Copy pom.xml and Maven wrapper
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Download dependencies
RUN ./mvnw dependency:resolve

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Spring Boot default is 8080)
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
