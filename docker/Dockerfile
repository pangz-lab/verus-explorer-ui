FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
# Startup script to replace environment variables
COPY docker_startup.sh /usr/local/bin/startup.sh

# Copy the NGINX configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /usr/local/bin/startup.sh

EXPOSE 80

# Override the default command
CMD ["sh", "-c", "/usr/local/bin/startup.sh && nginx -g 'daemon off;'"]