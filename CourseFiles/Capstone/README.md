# Azure Software Engineering Capstone Lab Guide

## Introduction

Welcome to the capstone lab for your Azure software engineering bootcamp. This exercise challenges you to apply the knowledge and skills you've acquired in implementing GitOps practices and cloud-based monitoring solutions. You'll work with a pre-configured multi-container application, focusing on continuous deployment and comprehensive monitoring in Azure.

## Project Overview

You are provided with a complete multi-container application consisting of:

1. Angular Frontend
2. Express.js Backend
3. Flask API
4. SQLite Database

Throughout the bootcamp, you built the application code, Dockerfiles, Docker Compose configuration, and Kubernetes manifests for this capstone. You will implement a GitOps deployment strategy and enhance the Express.js backend's monitoring capabilities.

## Prerequisites

Before beginning the capstone project, ensure you have the following components set up and configured:

### 1. Azure Kubernetes Service (AKS)

- An active AKS cluster deployed in your Azure subscription
- `kubectl` configured to interact with your AKS cluster
- Necessary permissions to create and manage resources within the AKS cluster

### 2. Azure Container Registry (ACR)

- An Standard tier ACR instance created in your Azure subscription
- Permissions to push and pull images from the ACR
- AKS configured to pull images from your ACR
- Anonymous pull enabled

### 3. Azure CLI

- Azure CLI installed on your VM
- Authenticated with your Azure account
- Configured to use the correct Azure subscription

### 4. Docker

- Docker Desktop installed on your local machine
- Ability to build and push Docker images

### 5. Kustomize

- Basic understanding of Kustomize overlay structure
- Existing Kustomize base configurations for your application components:
  - Angular frontend
  - Express.js backend
  - Flask API
  - SQLite database
- Kustomize overlays created for at least two environments (e.g., development and production)

### 6. Git Repository

- A Git repository set up to store your Kubernetes manifests and Kustomize files
- Git installed on your VM
- Necessary permissions to push changes to the repository

### 7. Kubernetes Manifests

- Existing Kubernetes manifests for your application components:
  - Deployments
  - Services
  - ConfigMaps (if applicable)
  - Secrets (if applicable)

### 

## Objectives

### 1. GitOps Implementation with Flux and Kustomize

Your primary task is setting up a GitOps workflow using Flux and Kustomize to deploy the application to Azure Kubernetes Service (AKS).

Key steps include:

- Setting up a Git repository for Kubernetes manifests
- Installing and configuring Flux in your AKS cluster
- Structuring your manifests using Kustomize
- Implementing a GitOps workflow for continuous deployment

Consider:
- How can you organize your Kustomize overlays for different environments (e.g., dev, staging, prod)?

### 2. Monitoring Integration in Express.js Backend

Enhance the Express.js server with Azure's monitoring solutions:

- Integrate Azure Application Insights for application performance monitoring
- Set up Azure Monitor for infrastructure and container monitoring
- Configure Azure Log Analytics for centralized logging

Consider:
- What key metrics and logs should you track for effective monitoring?
- How can you use these tools to gain actionable insights about your application's performance and health?
- What alerting strategies would be most effective for proactive issue resolution?

## Guidelines for Completion

1. Begin by thoroughly reviewing the application code, Dockerfiles, and Kubernetes manifests to understand the current setup.
2. Approach each objective methodically, leveraging the skills and knowledge from your bootcamp.
3. While specific steps aren't provided, refer to your class materials and Azure documentation as needed.
4. Focus on implementing best practices for GitOps and monitoring, considering scalability, security, and performance.
5. Ensure comprehensive error handling and logging throughout your implementation.
6. Document your design decisions and any challenges faced during the implementation.

## Submission and Presentation

Prepare a comprehensive presentation of your solution, including:

1. An overview of your GitOps workflow and how you've structured your Kustomize configurations.
2. A demonstration of your Flux setup, showing how changes in Git trigger deployments in AKS.
3. An explanation of monitoring for the Express.js backend showcasing the insights and alerts you've configured.
4. A discussion of key challenges encountered and your problem-solving approach.
5. Reflections on lessons learned and areas you've identified for future improvement.
6. A brief discussion on how this solution could be further enhanced.

Remember, this capstone project is your opportunity to showcase your proficiency in implementing GitOps practices and cloud monitoring solutions. Approach it with creativity and professionalism, and don't hesitate to go above and beyond the basic requirements if you see opportunities for innovation.

Good luck, and we look forward to seeing your impressive solutions!
