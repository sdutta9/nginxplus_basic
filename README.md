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
    └──  └── nginx-repo.key.........NGINX Plus repository key file (Use your evaluation key file)
etc
├── nginx
│   ├── conf.d
│   │   ├── health_checks.conf......Custom Healthcheck configurations
│   │   ├── status_api.conf.........NGINX Plus Live Activity Monitoring available on port 9000
│   │   ├── upstreams.conf..........Upstream configurations
│   │   ├── www.qc.termnc.com.conf..Virtual Server configuration for www.qc.termnc.com
│   │   └── www.termdm.com.conf.....Virtual Server configuration for www.termdm.com
│   ├── fastcgi_params
│   ├── includes
│   │   ├── add_headers
│   │   │   └── security.conf
│   │   ├── nap.d
│   │   │   └── logformats
│   │   │       └── config-illegal-requests.json
│   │   ├── proxy_headers
│   │   │   ├── keepalive.conf
│   │   │   └── proxy_headers.conf
│   │   └── ssl
│   │       ├── ssl_a+_strong.conf
│   │       ├── ssl_intermediate.conf
│   │       ├── ssl_modern.conf
│   │       └── ssl_old.conf
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types
│   ├── nginx.conf
│   ├── scgi_params
│   ├── uwsgi_params
│   └── win-utf
└── ssl
    └── nginx
        ├── nginx-repo.crt.........NGINX Plus repository certificate file (Use your evaluation crt file)
        └── nginx-repo.key.........NGINX Plus repository key file (Use your evaluation key file)
```

## Prerequisites:

1. NGINX evaluation license file. You can get it from [here](https://www.nginx.com/free-trial-request/)

2. A Docker host. With [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

3. **Optional**: The demo uses hostnames: `www.example.com`. For host name resolution you will need to add hostname bindings to your hosts file:

For example on Linux/Unix/MacOS the host file is `/etc/hosts`

```bash
# NGINX Plus demo system (local docker host)
127.0.0.1 www.nc.termnc.com www.termdm.com
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
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS         PORTS                                                                                                   NAMES
c78052ab1841   nginxplus_basic_nginx-plus   "nginx -g 'daemon of…"   3 minutes ago   Up 3 minutes   80/tcp, 0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 443/tcp, 0.0.0.0:9000->9000/tcp, :::9000->9000/tcp   nginxplus_basic_nginx-plus_1
c26f4ad92852   nginxplus_basic_nginx1       "/docker-entrypoint.…"   3 minutes ago   Up 3 minutes   80/tcp, 0.0.0.0:57378->808/tcp, 0.0.0.0:57379->8080/tcp                                                 nginxplus_basic_nginx1_1
1dfe56bd113d   nginxplus_basic_nginx2       "/docker-entrypoint.…"   3 minutes ago   Up 3 minutes   80/tcp, 0.0.0.0:57313->808/tcp, 0.0.0.0:57312->8080/tcp                                                 nginxplus_basic_nginx2_1
```

The demo environment is ready in seconds. You can access the `nginx-hello` demo website on **HTTP / Port 8080** ([`http://www.qc.termnc.com:8080`](https://www.qc.termnc.com:8080) or [https://www.termdm.com:8080](https://www.termdm.com:8080)) and the NGINX API on **HTTP / Port 8080** ([`http://localhost:9000`](http://localhost:9000))