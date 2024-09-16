### Practical Exercises in Setting Up Continuous Deployment  

#### Exercise Overview  
In this series of exercises, you will set up continuous deployment for an ExpressJS backend application using FluxCD. You will learn how to install and configure FluxCD, create and deploy a sample application, update the application, monitor the deployment, manage secrets, implement rolling updates, and scale the application.  

---

#### Lab Setup Instructions  
1. **Prerequisites**:  
   - Kubernetes cluster (e.g., Minikube, GKE, EKS)  
   - kubectl installed and configured  
   - Helm installed  
   - Git repository for storing deployment manifests. You can create a new repository with only a `README.md` file for this exercise.
   
2. **Setup Steps**:  
   - Use the sample ExpressJS backend application from the Docker Compose lab.  
   
   - Set up a Kubernetes cluster and configure kubectl to interact with it.  
  
  - Install Chocolatey with the following command: 
  
    ```powershell
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    ```
  
    
  
  - Use Chocolatey to install Helm.  
  
3. **Local Docker Image and Azure Container Registry (ACR)**
   - Make sure that you have an existing express-js image in a local docker service if not
   - Run `docker build -t express-server:flux .` in the express-server directory from the Containerization class to build a new image locally
   - Create an Azure Container registry by following this tutorial `https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal?tabs=azure-cli`
   - Use the Azure CLI `https://learn.microsoft.com/en-us/cli/azure/install-azure-cli` to login to ACR using
      ```sh
      az acr login --name <acr-name>
      ```
   - Tag your image to the Azure container registry `docker tag express-server:flux <acr-name>.azurecr.io/fluxexamples/express-server:flux`
   - Push the Docker image to the azure container registry using `docker push <acr-name>.azurecr.io/fluxexamples/express-server:flux`
    
      *NOTE: Alternatively, you can use a local docker or dockerhub registry instead of ACR. If you use a local registry, add the registry address to the insecure_registries in the /etc/docker/daemon.js of the kubernetes cluster*
   
---

#### Exercise 1: Install and Configure FluxCD  

In this exercise, you will install the FluxCD CLI and bootstrap FluxCD on your Kubernetes cluster. This involves setting up the necessary components and configuring FluxCD to monitor a Git repository for deployment manifests.  

1. **Install FluxCD CLI if you haven't**:  
   ```sh  
   choco install flux -y
   ```
   
2. **Bootstrap FluxCD on Kubernetes**:  
   - Run the following as one command.
   ```sh  
   flux bootstrap github \  
     --token-auth \
     --owner=<github-username> \  
     --repository=<repository-name> \  
     --branch=main \  
     --path=./clusters/my-cluster \  
     --personal  
   ```
   
3. **Verify FluxCD Installation**:  
   ```sh  
   kubectl get pods -n flux-system  
   ```

4. **Clone your FluxCD bootstrapped respository**
   
   ```sh
   git clone https://github.com/<org>/<repository>.git
   ```

   If you don't have `git` installed, use `choco` to install it.
   
#### Exercise 2: Create and Deploy a Sample Application  

In this exercise, you will create Kubernetes deployment and service manifests for the ExpressJS backend application. You will then commit and push these manifests to your Git repository, and use FluxCD to apply them to your Kubernetes cluster.  The deployment manifest `<repository-name>/deployment.yaml` defines the desired state for your application, including the number of replicas, the container image to use, and the ports to expose. 

1. **Create an Azure Service Principal**

   Create an Azure service principal using the `az` command to authenticate to Azure Container Registry.

2. **Create a Kubernetes Secret for ACR** 
   You need to create a Kubernetes secret that contains your ACR credentials. Replace <acr-name> with your ACR name and <service-principal-id> and <service-principal-password> with your Azure service principal credentials.

   ```sh
      kubectl create secret docker-registry acr-secret \
      --docker-server=<acr-name>.azurecr.io \
      --docker-username=<service-principal-id> \
      --docker-password=<service-principal-password> \
      --docker-email=<your-email>
   ```

3. **Create Kubernetes Deployment YAML for ExpressJS App**:  

   ```yaml  
      apiVersion: apps/v1  
      kind: Deployment  
      metadata:  
      name: expressjs-backend  
      namespace: default  
      spec:  
      replicas: 2  
      selector:  
         matchLabels:  
            app: expressjs-backend  
      template:  
         metadata:  
            labels:  
            app: expressjs-backend  
         spec:  
            containers:  
            - name: expressjs-backend  
            image: <acr-name>.azurecr.io/fluxexamples/express-server:flux
            ports:  
            - containerPort: 4000  
            imagePullSecrets:
            - name: acr-secret
   ```

4. **Create Kubernetes Service YAML for ExpressJS App**:  

   The service manifest `<repository>/service.yaml` defines how to expose your application to other services within the cluster or to external clients. It creates a stable endpoint (a DNS name) for accessing the pods running your application.

   ```yaml  
   apiVersion: v1  
   kind: Service  
   metadata:  
     name: expressjs-backend  
     namespace: default  
   spec:  
     selector:  
       app: expressjs-backend  
     ports:  
       - protocol: TCP  
         port: 80  
         targetPort: 4000  
   ```

5. **Commit and Push Manifests to Git Repository**:  

   ```sh  
      git add .  
      git commit -m "Add ExpressJS backend deployment and service"  
      git push origin main  
   ```

6. **Apply Manifests Using FluxCD**:  
   ```sh  
   flux reconcile kustomization flux-system --with-source  
   ```

7. **Check the Deployment Status**

   ```sh
      kubectl get deployments -n default
      kubectl get pods -n default -l app=expressjs-backend
   ```

8. **Troubleshoot**

   If the deployment and service are not created, update the `kustomization.yaml` file in the `clusters/my-cluster/flux-system`to explicitly reference the files. 



---

#### Exercise 3: Implement Rolling Updates  

In this exercise, you will implement rolling updates for the ExpressJS backend application by updating the deployment manifest with a rolling update strategy. You will then commit and push the updated manifest to your Git repository, and use FluxCD to apply the changes to your Kubernetes cluster.  

1. **Update Deployment YAML with Rolling Update Strategy**:  
   ```yaml  
   spec:  
     strategy:  
       type: RollingUpdate  
       rollingUpdate:  
         maxUnavailable: 1  
         maxSurge: 1  
   ```
   
2. **Commit and Push Updated Manifest to Git Repository**:  
   ```sh  
   git add .  
   git commit -m "Implement rolling updates for ExpressJS backend"  
   git push origin main  
   ```
   
3. **Apply Updated Manifest Using FluxCD**:  
   ```sh  
   flux reconcile kustomization flux-system --with-source  
   ```
   
---

#### Exercise 4: Scale the Application  

In this exercise, you will scale the ExpressJS backend application by updating the deployment manifest to increase the number of replicas. You will then commit and push the updated manifest to your Git repository, and use FluxCD to apply the changes to your Kubernetes cluster.  

1. **Update Deployment YAML to Scale Replicas**:  
   ```yaml  
   spec:  
     replicas: 5  
   ```
   
2. **Commit and Push Updated Manifest to Git Repository**:  
   ```sh  
   git add .  
   git commit -m "Scale ExpressJS backend to 5 replicas"  
   git push origin main  
   ```
   
3. **Apply Updated Manifest Using FluxCD**:  
   ```sh  
   flux reconcile kustomization flux-system --with-source  
   ```
   
---


These detailed exercises provide a comprehensive guide for setting up continuous deployment for an ExpressJS backend application using FluxCD, including installation, deployment, updates, monitoring, secrets management, rolling updates and scaling.