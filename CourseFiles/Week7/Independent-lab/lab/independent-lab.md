# Migrating from Docker-Compose to Kustomize

## Introduction

In this exercise, you’ll be migrating an existing docker-compose setup to a Kubernetes-based deployment using kustomize. The goal is to restructure your existing configuration into a modular, maintainable format that leverages the flexibility of Kubernetes and kustomize for managing multiple environments.

## Objectives

1. Understand how to translate docker-compose services into Kubernetes manifests.
2. Organize your configuration files into a logical directory structure using kustomize.
3. Enable the reusability of base configurations for multiple environments (e.g., development, staging, production).
4. Gain familiarity with defining kustomize overlays to manage environment-specific customizations.

## Steps to Follow

### 1. Analyze Your Docker-Compose Configuration

Before starting the migration, take some time to review your `docker-compose.yml` file. Identify the services, volumes, and networks defined within it. Pay special attention to:

- **Services**: How many are there? What are their dependencies?
- **Volumes**: Which services share volumes, and what data are they storing?
- **Networks**: How are services communicating with each other?

This analysis will help you understand how to split and organize your Kubernetes manifests.

### 2. Create a Base Structure for Kustomize

You should create a directory structure similar to the following:

```sh
kustomize/
├── base/
│   ├── kustomization.yaml
│   ├── frontend/
│   │   └── kustomization.yaml
│   ├── backend/
│   │   └── kustomization.yaml
│   ├── database/
│   │   └── kustomization.yaml
│   ├── ingress/
└── └── └── kustomization.yaml

```
# Tips for Migrating from Docker-Compose to Kustomize

- **Base Directory**: 
  - The subdirectories under 'base' will contain your reusable Kubernetes resources such as Deployments, Services, and ConfigMaps. 
  - Organize all core components here, making them easy to reference across different environments.

## Step 3: Create Kubernetes Manifests

Translate each service in your `docker-compose.yml` into a corresponding Kubernetes resource:

- **Deployments**: 
  - Use these to define how your containers will be deployed in the cluster. 
  - Each service in your docker-compose file will typically become a separate Deployment resource.

- **Services**: 
  - Define these to expose your Deployments to internal or external traffic as needed. 
  - Map ports as per your docker-compose configurations to ensure service connectivity.

# Step-by-Step Guide for Configuring Kustomize

## Step 4: Configure Kustomization Files

- **Base `kustomization.yaml` File**:
  - Create a single `kustomization.yaml` file in the `base/` directory to include all the resources related to your application.
  - This should reference the individual YAML files for each category such as Deployment, Service, ConfigMap, and Secret within the base directory structure.

- **Modular Approach**:
  - This setup helps organize and manage different parts of the application separately while keeping a single source of truth in the base configuration.
  - Using a modular approach makes it easier to handle changes and updates across different environments like development, staging, and production.

## Step 6: Build Docker Images

- **Build Docker Images**:
  - Make sure that all Docker images for your services are built before they are deployed to the Kubernetes cluster. 
  - You can continue using docker-compose to build and tag your images. It contains the configuration to allow you to do this. Keep in mind, you should use a unique tag every time you rebuild your image. Not doing this can lead to unexpected behaviour.

## Step 8: Create ACR
- **Push to a Container Registry**:
  - After building, push the Docker images to a container registry like Docker Hub or Azure Container Registry. This step makes the images accessible to the Kubernetes cluster.

- **Update Image References**:
  - In your Kubernetes manifests, update the image references to point to the newly built and pushed images. This ensures that the cluster pulls the correct images for deployment.

## Step 9: Give permissions to AKS to pull images from ACR

- **AKS ACR permissions**:
  - AKS needs permission to pull container images from ACR. Link your AKS cluster with the ACR using:

## Step 10: Install ingress

- **Nginx Ingress installation**:
  - To manage HTTP routing in your AKS cluster, install the NGINX ingress controller. Use the public IP of your AKS cluster. It should be in a resource group with this format 'MC_<your-rg-name>_<your-aks-cluster-name>_<aks_cluster_region>'

## Step 11: Apply the Configuration

- **Deploy to Kubernetes**:
  - Once your kuztomize configurations are defined, deploy them to your Kubernetes cluster.
  - In order to access your cluster in order to deploy your configuration, you will need to authenticate to the cluster.

## Step 12: Set up frontend routing

- **Angular routing to k8s services**:
  - In order to route traffic from your frontend to your backend, you can use load balancer services. Grab the IP from both load balancer services, and update your angular application to point at these IPs. 

### Step 16: Redeploy your services
- **Final deploy**:
  - Rebuild your containers using docker-compose. Tag them with a unique tag and push them to your ACR. Set the new tag in your kustomization files and redeploy. Once your pods are in a steady state, the app should now work as expected

## Congratulations! You've finished the lab!

Congratulations on completing the guide! You've taken an important step in mastering Kustomize and Kubernetes configurations. Keep experimenting and refining your skills. Great job!