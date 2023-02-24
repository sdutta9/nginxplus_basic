# For Ubuntu 20.04:
FROM ubuntu:focal

LABEL maintainer="sh.dutta@f5.com"

# Download certificate and key from the customer portal (https://cs.nginx.com)
# and copy to the build context:
COPY etc/ssl/nginx/nginx-repo.* /etc/ssl/nginx/
RUN chmod 644 /etc/ssl/nginx/* 

# Install prerequisite packages:
RUN apt-get update && apt-get install -y apt-transport-https lsb-release ca-certificates wget gnupg2

# Download and add the NGINX signing key:
RUN wget https://cs.nginx.com/static/keys/nginx_signing.key && apt-key add nginx_signing.key

# Add NGINX Plus repository:
RUN printf "deb https://pkgs.nginx.com/plus/ubuntu `lsb_release -cs` nginx-plus\n" | tee /etc/apt/sources.list.d/nginx-plus.list

# Download the nginx-plus apt configuration to `/etc/apt/apt.conf.d`:
RUN wget -P /etc/apt/apt.conf.d https://cs.nginx.com/static/files/90pkgs-nginx

# Update the repository and install the most recent version of the NGINX Plus:
RUN apt-get update && apt-get install -y nginx-plus

# Copy certificate files and dhparams
COPY etc/ssl /etc/ssl

# COPY /etc/nginx (Nginx configuration) directory
COPY etc/nginx /etc/nginx

# Forward request logs to Docker log collector:
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Remove the Nginx Plus cert/keys from the image:
RUN rm /etc/ssl/nginx/nginx-repo.crt /etc/ssl/nginx/nginx-repo.key


# EXPOSE ports, HTTP 80, HTTPS 443 and, Nginx status page 8080
EXPOSE 80 443 8080
STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]