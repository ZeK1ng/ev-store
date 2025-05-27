# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy your WAR file into the container
COPY ./home/runner/work/ev-store/ev-store/ev-store-be/target/ev-store-*.war app.war

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the WAR using java -jar
ENTRYPOINT ["java", "-jar", "app.war"]