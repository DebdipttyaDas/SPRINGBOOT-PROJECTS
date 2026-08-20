# Stage 1: Build JAR using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy all source files and package application (skipping unit tests during container build)
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Java Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Expose container port
EXPOSE 8080

# Copy generated executable jar
COPY --from=builder /build/target/*.jar app.jar

# JVM options optimized for cloud free tier containers
ENV JAVA_OPTS="-Xmx384m -Xss512k -XX:+UseSerialGC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -jar app.jar"]
