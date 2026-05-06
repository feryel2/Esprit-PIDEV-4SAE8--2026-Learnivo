FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy the Angular build output (browser directory) to Nginx
COPY dist/frontend-v21/browser .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
