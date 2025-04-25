# 构建阶段
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /backend

# 当前 context 是 backend/，所以路径直接用相对路径
COPY .env.prod .env
COPY . .

RUN ./mvnw clean package -DskipTests

# 运行阶段
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /backend

COPY --from=builder /backend/target/*.jar dbbikes-backend.jar
COPY --from=builder /backend/.env .env

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "dbbikes-backend.jar"]
