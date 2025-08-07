# Use the official Nginx image to serve static content
FROM nginx:alpine

# Copy all UI files to the default Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow traffic from the Load Balancer
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
