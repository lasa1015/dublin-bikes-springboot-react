# 构建阶段
FROM eclipse-temurin:17-jdk as builder
WORKDIR /backend

# 注意：不要COPY .env了！
COPY . .

RUN ./mvnw clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jdk
WORKDIR /backend

COPY --from=builder /backend/target/*.jar dbbikes-backend.jar
# 注意：也不要COPY .env了！

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "dbbikes-backend.jar"]
