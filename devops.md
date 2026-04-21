# 🚀 DevOps & Production Readiness

This document provides a professional, step-by-step guide to take this project from local development to production deployment, following best DevOps practices.

---

## 📁 Project Folder Structure

```
devops/
├── docker/
│   ├── Dockerfile
│   └── compose.yml
├── security-reports/
│   ├── trivy-fs.txt
│   ├── trivy-image.txt
│   └── sbom-image-cyclonedx.json
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

docker compose -f devops/docker/compose.yml --env-file .env up -d
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
docker compose -f devops/docker/compose.yml --env-file .env down -v
```

---

## 🟢 Phase 3: Security Scanning with Trivy

In this phase, we introduce automated security scanning into the workflow. We use Trivy to scan both the project files and the Docker image for vulnerabilities, misconfigurations, secrets, and license issues. This ensures that the application and its dependencies are safe before deploying to production. Additionally, we generate a Software Bill of Materials (SBOM), which is a comprehensive list of all components, dependencies, and their versions included in the image. The SBOM is essential for transparency, compliance, and tracking potential vulnerabilities in the supply chain.

### Steps

1. **Scan project files for vulnerabilities**
   ```sh
   trivy fs . \
     --scanners vuln,misconfig,secret,license \
     --severity HIGH,CRITICAL \
     --format table \
     --output devops/security-reports/trivy-fs.txt
   ```
2. **Build the Docker image**
   ```sh
   docker build -t todo-project:v3 -f devops/docker/Dockerfile .
   ```
3. **Scan the Docker image for vulnerabilities**
   ```sh
   trivy image todo-project:v3 \
     --scanners vuln,misconfig,secret,license \
     --severity HIGH,CRITICAL \
     --format table \
     --output devops/security-reports/trivy-image.txt
   ```
4. **Generate the SBOM (Software Bill of Materials)**
   ```sh
   trivy image todo-project:v3 \
     --format cyclonedx \
     --output devops/security-reports/sbom-image-cyclonedx.json
   ```
5. **Tag and push the image**
   ```sh
   docker tag todo-project:v3 marciogabriel1998/todo-project:v3
   docker tag todo-project:v3 marciogabriel1998/todo-project:latest

   docker push marciogabriel1998/todo-project:v3
   docker push marciogabriel1998/todo-project:latest
   ```

---

## 🟢 Phase 4: Kubernetes Deployment with Kind

In this phase, we create a local Kubernetes cluster using Kind to orchestrate and deploy the application. The cluster will have three control plane nodes and multiple worker nodes, with Calico as the Container Network Interface (CNI) for networking.

### Steps

1. **Create a local Kubernetes cluster with Kind**
   ```sh
   kind create cluster --config devops/kind/kind-config.yml --name local-cluster
   ```

2. **Verify cluster connectivity**
   ```sh
   kubectl cluster-info --context kind-local-cluster
   ```

3. **Check cluster nodes and wait for readiness**
   ```sh
   kubectl get nodes
   ```

4. **Verify API resources and cluster configuration**
   ```sh
   kubectl api-resources
   ```

### Configuration Notes
- **Cluster Name**: `local-cluster`
- **Port**: `3000` (mapped from host)
- **CNI**: Calico (CNI plugin disabled by default in Kind config)
- **Control Plane Nodes**: 3
- **Worker Nodes**: Multiple (as per Kind config)

---

## 🟢 Phase 5: Kubernetes Manifests Deployment

In this phase, we deploy the application to Kubernetes using manifest files managed with kubectl. The setup uses a Secret for environment configuration and a Deployment manifest that includes the database, the application, and their corresponding Services. The deployment also defines readiness and liveness probes, along with the image pull policy required for reliable pod startup.

### Steps

1. **Apply the Secret manifest**
   ```sh
   kubectl apply -f devops/k8s/secret.yml
   ```

2. **Verify the Secret was created**
   ```sh
   kubectl get secrets
   kubectl describe secret app-secret
   ```

3. **Apply the Deployment and Service manifests**
   ```sh
   kubectl apply -f devops/k8s/deployment.yml
   ```

4. **Clean up the Kubernetes resources**
   ```sh
   kubectl delete -f devops/k8s/secret.yml
   kubectl delete -f devops/k8s/deployment.yml
   kind delete cluster --name local-cluster
   ```

### What Was Configured
- A Secret for application and database environment variables.
- Deployments for the Postgres database and the NestJS application.
- Services for internal database access and application exposure.
- Readiness and liveness probes for health monitoring.
- Image pull policy for controlled image retrieval.

## 📝 Notes
- All commands should be run from the project root.

