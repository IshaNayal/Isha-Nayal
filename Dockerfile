FROM nginx:alpine

COPY portfolio.css /usr/share/nginx/html/
COPY Portfolio.html /usr/share/nginx/html/index.html
COPY sections.jsx /usr/share/nginx/html/
COPY tweaks_panel.jsx /usr/share/nginx/html/
COPY effects.jsx /usr/share/nginx/html/
COPY tree.css /usr/share/nginx/html/
COPY tree.js /usr/share/nginx/html/
COPY Portfolio.html.srcmap.json /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]