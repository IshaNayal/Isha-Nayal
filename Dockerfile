FROM nginx:alpine

# Copy static files
COPY portfolio.css /usr/share/nginx/html/
COPY Portfolio.html /usr/share/nginx/html/index.html
COPY sections.jsx /usr/share/nginx/html/
COPY tweaks_panel.jsx /usr/share/nginx/html/
COPY effects.jsx /usr/share/nginx/html/
COPY Portfolio.html.srcmap.json /usr/share/nginx/html/

# Custom nginx config
RUN echo 'server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]