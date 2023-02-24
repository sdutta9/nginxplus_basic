## File Structure

```
etc/
└── nginx/
    ├── conf.d/
    │   ├── example.com.conf .......Virtual Server configuration for www.example.com
    │   ├── www2.example.com.conf .......Virtual Server configuration for www2.example.com
    │   ├── upstreams.conf..........Upstream configurations
    │   └── status_api.conf.........NGINX Plus Live Activity Monitoring available on port 8080
    └── nginx.conf .................Main NGINX configuration file with global settings
└── ssl/
    └── nginx/
    │    ├── nginx-repo.crt.........NGINX Plus repository certificate file (Use your evaluation crt file)
    │    └── nginx-repo.key.........NGINX Plus repository key file (Use your evaluation key file)
    ├── example.com.crt.............Self-signed wildcard cert for *.example.com
    └── example.com.key.............Private key for Self-signed wildcard cert for *.example.com
```

## Prerequisites:

1. NGINX evaluation license file. You can get it from [here](https://www.nginx.com/free-trial-request/)

2. A Docker host. With [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

3. **Optional**: The demo uses hostnames: `www.example.com`. For host name resolution you will need to add hostname bindings to your hosts file:

For example on Linux/Unix/MacOS the host file is `/etc/hosts`

```bash
# NGINX Plus demo system (local docker host)
127.0.0.1 www.example.com
```

> **Note:**
> DNS resolution between containers is provided by default using a new bridged network by docker networking and
> NGINX has been preconfigured to use the Docker DNS server (127.0.0.11) to provide DNS resolution between NGINX and
> upstream servers

## Build and run the demo environment

Provided the Prerequisites have been met before running the stpes below, this is a **working** environment.

### Build the demo

In this demo we will have a one NGINX Plus ADC/load balancer (`nginx-plus`) and three NGINX webserver (`nginx1`,`nginx2` and `nginx3`)

Before we can start, we need to copy our NGINX Plus repo key and certificate (`nginx-repo.key` and `nginx-repo.crt`) into the directory, `nginx-plus/etc/ssl/nginx/`, then build our stack:

```bash
# Enter working directory
cd NGINXPLUS_BASIC

# Make sure your Nginx Plus repo key and certificate exist here
ls nginx-plus/etc/ssl/nginx/nginx-*
nginx-repo.crt              nginx-repo.key

# Downloaded docker images and build
docker-compose pull
docker-compose build --no-cache
```

#### Start the Demo stack:

Run `docker-compose` in the foreground so we can see real-time log output to the terminal:

```bash
docker-compose up
```

Or, if you made changes to any of the Docker containers or NGINX configurations, run:

```bash
# Recreate containers and start demo
docker-compose up --force-recreate
```

**Confirm** the containers are running. You should see three containers running:

```bash
$> docker ps                                          
CONTAINER ID   IMAGE                                  COMMAND                  CREATED         STATUS         PORTS                                                              NAMES
860d39ccce3d   nginxplus_basic-nginx-plus             "nginx -g 'daemon of…"   5 minutes ago   Up 5 minutes   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp, 0.0.0.0:8080->8080/tcp   nginxplus_basic-nginx-plus-1
8452135610b3   nginxplus_basic-nginx2                 "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:51144->80/tcp                                              nginxplus_basic-nginx2-1
ff4ca95a65a6   nginxplus_basic-nginx3                 "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:51145->80/tcp                                              nginxplus_basic-nginx3-1
d4f0cc225414   nginxplus_basic-nginx1                 "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   80/tcp                                                             nginxplus_basic-nginx1-1
472ba4f7f039   nginx/nginx-prometheus-exporter:0.11   "/usr/bin/nginx-prom…"   5 minutes ago   Up 5 minutes   0.0.0.0:9113->9113/tcp                                             nginxplus_basic-prometheus-1
```

The demo environment is ready in seconds. You can access the `nginx-hello` demo website on **HTTPS / Port 443** (https://localhost or https://www.example.com) and the NGINX API on **HTTP / Port 8080** (http://localhost:8080)

### Prometheus Exporter

This branch also runs a `nginx-prometheus-exporter` image which is used to expose all the plus metrics using prometheus exporter. For more details about this image look into its github repository(https://github.com/nginxinc/nginx-prometheus-exporter).

You can access the exported metrics by prometheus by navigating to (http://localhost:9113/metrics)