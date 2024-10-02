# Multi-Container Application

This repository contains a multi-container application that includes the following components:

- **Angular**: Frontend application
- **Express Server**: Backend server
- **Flask API**: Additional backend API
- **SQLite Database**: Lightweight database for storage

## Current Setup

The application is currently set up to run using Docker Compose. This setup allows you to easily build and run the application locally with all its components.

## Migration to AKS

There is a case to move this application into Azure Kubernetes Service (AKS) for better scalability and management. To facilitate this migration, we will use Kustomize to manage the Kubernetes configurations.

## Lab Guide

For detailed instructions on how to migrate the application to AKS using Kustomize, please refer to the lab guide located at `lab/independent-lab.md`.

## Getting Started

### Running Locally with Docker Compose

1. **Build and Run**:
   ```sh
   docker-compose up --build
