FROM node:20-bookworm AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

RUN npm run build \
    && mkdir -p /frontend-dist \
    && BUILD_DIR="$(find dist -type f -name index.html -print -quit | xargs dirname)" \
    && cp -r "${BUILD_DIR}"/. /frontend-dist/

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend-dist/ /usr/share/nginx/html/

EXPOSE 80
