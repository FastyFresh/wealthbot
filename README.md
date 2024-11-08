# Wealthbot Docker Setup

This repository contains Docker configurations for both development and production environments.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Testing the Application

### Development Environment

1. Start the development environment:
```bash
docker-compose up frontend-dev --build
```
This will:
- Build the development container
- Start the development server on port 3001
- Enable hot-reloading for development
- Mount your local files into the container

Access the development version at: http://localhost:3001

### Production Environment

1. Start the production environment:
```bash
docker-compose up frontend-prod --build
```
This will:
- Build an optimized production version
- Serve it through Nginx on port 80
- Use production-optimized settings

Access the production version at: http://localhost:80

## Docker Commands Reference

### View Logs
```bash
# View development logs
docker-compose logs frontend-dev

# View production logs
docker-compose logs frontend-prod
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop frontend-dev
docker-compose stop frontend-prod
```

### Rebuild Services
```bash
# Rebuild development
docker-compose up frontend-dev --build

# Rebuild production
docker-compose up frontend-prod --build
```

## Configuration

- Development server runs on port 3001
- Production server runs on port 80
- Environment variables are configured in docker-compose.yml
- Nginx configuration is located at frontend/nginx.conf
- Development configuration is in frontend/Dockerfile.dev
- Production configuration is in frontend/Dockerfile

## Troubleshooting

If you encounter any issues:

1. Check the logs:
```bash
docker-compose logs frontend-dev
# or
docker-compose logs frontend-prod
```

2. Rebuild the containers:
```bash
docker-compose down
docker-compose up frontend-dev --build
# or
docker-compose up frontend-prod --build
```

3. Clean Docker cache:
```bash
docker system p