# 🚀 DevOps & Production Readiness

This document provides a professional, step-by-step guide to take this project from local development to production deployment, following best DevOps practices.

---

## 📁 Project Folder Structure

```
todo-project/
├── devops.md                   # DevOps and deployment instructions (this file)
├── devops/
│   └── docker/
│       ├── Dockerfile          # Docker build instructions for the app
│       └── compose.yml         # Docker Compose for local/development
```

---


## 🟢 Phase 1: Local Docker & Compose Setup

### Steps

1. **Build the Docker Image**
	```sh
	docker build -t todo-project:v1 -f devops/docker/Dockerfile .
	```
2. **Check the built image**
	```sh
	docker image ls
	```
3. **Run with Docker Compose**
	- Start the stack (app + Postgres) using your `.env` file:
	  ```sh
	  docker-compose -f devops/docker/compose.yml --env-file .env up -d
	  ```
	- Or build and run in one step:
	  ```sh
	  docker-compose -f devops/docker/compose.yml --env-file .env up --build
	  ```

#### 📦 Example Image Size
After building, you may see something like:
```
REPOSITORY         TAG       IMAGE ID       SIZE
todo-project       v1        3df860c416de   507MB
```

---

### ✅ What Was Done in Phase 1

- Created a Dockerfile for the application.
- Set up a Docker Compose file to orchestrate the app and Postgres database.
- Built and tested the Docker image locally.
- Used environment variables from a `.env` file for configuration.
- Verified the image size and successful container startup.

---

## 🟢 Phase 2: Docker & Compose Optimization

### Steps

1. **Optimize Dockerfile**
	- Improved layer usage and cache efficiency for smaller, faster builds.
	- Switched to a multi-stage build to keep only production dependencies and build output in the final image.
2. **Enhance Compose File**
	- Added healthchecks and restart policies for resilience.
	- Introduced container resource limits (CPU & memory) for deployment.
	- Added a custom network and depends_on with healthcheck for service startup order.

### Commands Used

```sh
docker build -t todo-project:v2 -f devops/docker/Dockerfile .
docker image ls
```

#### Example Image Size Reduction
```
REPOSITORY         TAG       IMAGE ID       SIZE
todo-project       v2        919c8ad05b3f   121MB
```

```sh
docker tag todo-project:v2 marciogabriel1998/todo-project:latest
docker push marciogabriel1998/todo-project:latest
```

To clean up containers and volumes:
```sh
docker compose -f devops/docker/compose.yml down -v
```

---

## 📝 Notes
- All commands should be run from the project root.