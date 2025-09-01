FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npm run build

FROM nginx:1.29-alpine AS runner

ENV APP_PREFIX=HENSHI_ENV_

COPY ./infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .

COPY env.sh /docker-entrypoint.d/env.sh
RUN dos2unix /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
