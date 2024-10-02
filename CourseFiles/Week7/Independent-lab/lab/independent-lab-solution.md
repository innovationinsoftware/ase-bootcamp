### Prerequisites:
1. **Install Docker**  
   Docker is required to build and manage your container images. Install Docker by following the official [Docker documentation](https://docs.docker.com/get-docker/).

2. **Install Kustomize**  
   Kustomize allows you to customize Kubernetes YAML configurations. Install it by running:
   ```bash
   sudo apt-get install -y kustomize  # For Ubuntu/Debian
   ```

### Step 1: Create an Azure Resource Group
A resource group is a logical container where all your Azure resources (AKS, ACR, etc.) will be grouped.

```bash
az group create -g myResourceGroup --location eastus
```

- Replace `myResourceGroup` with your preferred name.
- The `--location` parameter defines the region where the resources will be hosted (e.g., eastus, westus, etc.).

### Step 2: Create an AKS Cluster
Create an Azure Kubernetes Service (AKS) cluster with two nodes. The `--generate-ssh-keys` flag will automatically generate SSH keys for secure access to nodes.

```bash
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --generate-ssh-keys --location eastus
```

- You can change `node-count` if you want more nodes initially.
- Adjust the region with `--location` if needed.

### Step 3: Create an Azure Container Registry (ACR)
Create a private container registry to store your Docker images. ACR provides private Docker image storage in Azure.

```bash
az acr create --resource-group myResourceGroup --name myacr121843 --sku Standard --location eastus
```

Make sure the `--name` is globally unique as it’s used to identify your registry across Azure.

### Step 4: Enable Anonymous Pull for ACR
If you want anyone to pull images from your ACR without authentication:

```bash
az acr update --name myacr121843 --anonymous-pull-enabled true
```

### Step 5: Login to ACR
Log in to your Azure Container Registry so that you can push images to it.

```bash
az acr login --name myacr121843
```

### Step 6: Update Docker Compose for ACR Integration
In your `docker-compose.yaml`, update the `image` fields to include your ACR name:

For example:
```yaml
image: myacr121843.azurecr.io/optum-azure-capstone-solution-archi-connect-frontend:${IMAGE_TAG}
```

### Step 7: Build and Tag Docker Images
You’ll now build your Docker images and tag them with a version for clarity.

```bash
export IMAGE_TAG=v1  # Set a unique tag for your images
sudo IMAGE_TAG=v1 docker-compose build --no-cache  # Build the images
```

### Step 8: Push Images to ACR
Now push the images to your Azure Container Registry (ACR). Use the following script to push all images at once:

```bash
# Define your list of images
IMAGES=(
    "myacr121843.azurecr.io/optum-azure-capstone-express-server"
    "myacr121843.azurecr.io/optum-azure-capstone-angular-app"
    "myacr121843.azurecr.io/optum-azure-capstone-flask-api"
)

# Loop through each image and push it to ACR
for image in "${IMAGES[@]}"; do
    docker push "${image}:${IMAGE_TAG}"
done
```

### Step 9: Allow AKS to Pull from ACR
AKS needs permission to pull container images from ACR. Link your AKS cluster with the ACR using:

```bash
az aks update --resource-group myResourceGroup --name myAksCluster --attach-acr myacr121843
```

### Step 10: Get AKS Credentials
Now you can retrieve credentials for your AKS cluster to manage it locally:

```bash
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

This will configure `kubectl` to use your AKS cluster.

### Step 11: Update Kustomization YAML
Update the image tags in your `base/kustomization.yaml` to reflect the newly built images with the correct tags. For example:

```yaml
images:
  - name: myacr121843.azurecr.io/optum-azure-capstone-solution-express-server
    newTag: v1
```

Repeat this step for all services.

### Step 13: Install Ingress Controller
To manage HTTP routing in your AKS cluster, install the NGINX ingress controller. Use the public IP of your AKS cluster. It should be in a resource group with this format 'MC_<your-rg-name>_<your-aks-cluster-name>_<aks_cluster_region>'

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --set controller.service.loadBalancerIP=<your-public-ip>
```

### Step 14: Deploy Your Application
Apply your Kustomize configuration to deploy the application in AKS:

```bash
kubectl apply -k ./kustomize/base
```

This will set up your applications with the correct configuration and start pulling the images from ACR.

### Step 15: Set up frontend routing

Set anything 'localhost:3000' to the public IP and port of your express-server service

Set anything 'localhost:5000' to the public IP and port of your flask-api service

### Step 16: Redeploy your services

Rebuild your containers using docker-compose. Tag them with a unique tag and push them to your ACR. Set the new tag in your kustomization files and redeploy. Once your pods are in a steady state, the app should now work as expected
