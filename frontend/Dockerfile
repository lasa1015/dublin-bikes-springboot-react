
FROM node:18-alpine AS builder

WORKDIR /app


ARG VITE_GOOGLE_MAPS_API_KEY


ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY


COPY . .

RUN npm install && npm run build


FROM nginx:alpine


RUN rm /etc/nginx/conf.d/default.conf


COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
