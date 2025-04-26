# ---------- 构建阶段 ----------
FROM node:18-alpine AS builder

WORKDIR /app

# 接收构建时传入的环境变量（比如 VITE_GOOGLE_MAPS_API_KEY）
ARG VITE_GOOGLE_MAPS_API_KEY

# 明确声明环境变量，提供给 vite 使用
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# 复制项目文件
COPY . .

# 安装依赖并构建
# 显式指定生产模式构建
RUN npm install && npm run build

# ---------- 部署阶段 ----------
FROM nginx:alpine

# 删除默认 nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 添加自定义配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝打包好的前端资源
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
