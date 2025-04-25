# ---------- 构建阶段 ----------
  FROM node:18-alpine AS builder

  WORKDIR /app
  
  # 复制项目文件
  COPY . .
  
  # 安装依赖并构建
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
  