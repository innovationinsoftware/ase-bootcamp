### Lab Exercise: CI/CD Pipeline with FluxCD and Monitoring  

#### **Lab Setup Instructions**  
1. **Prerequisites**:  
   - Windows OS with Docker Desktop installed.  
   - Kubernetes cluster (e.g., Minikube, GKE, EKS).  
   - `kubectl` installed and configured.  
   - Helm installed.  
   - GitHub account for storing deployment manifests.  
   - Azure account for Application Insights.  
   
2. **Setup Steps**:  
   - Set up a Kubernetes cluster and configure `kubectl` to interact with it.  
   - Install Helm and add the necessary repositories.  
   
---

#### **Exercise 1: Build Angular and ExpressJS Applications from Scratch**  
1. **Create Angular Frontend Application**:  
   - Install Angular CLI if you don't have it on your system:  
     ```sh  
     npm install -g @angular/cli  
     ```
   - Create a new Angular project:  
     ```sh  
     ng new angular-frontend  
     ```
   - Navigate to the project directory and serve the application:  
     ```sh  
     cd angular-frontend  
     ng serve  
     ```
   
2. **Create ExpressJS Backend Application**:  
   - Create a new directory for the backend:  
     ```sh  
     mkdir express-backend  
     cd express-backend  
     ```
   - Initialize a new Node.js project:  
     ```sh  
     npm init -y  
     ```
   - Install Express:  
     ```sh  
     npm install express  
     ```
   - Create a simple Express server (`index.js`), feel free to modify the application code:  
     ```javascript  
     const express = require('express');  
     const app = express();  
     const port = 3000;  
    
     app.get('/', (req, res) => {  
       res.send('Hello from ExpressJS!');  
     });  
    
     app.listen(port, () => {  
       console.log(`Server is running on http://localhost:${port}`);  
     });  
     ```
   - Run the Express server:  
     ```sh  
     node index.js  
     ```
   
---

#### **Exercise 2: Containerize the Applications**  
1. **Create Dockerfile for Angular Frontend**:  
   - In the `angular-frontend` directory, create a `Dockerfile` and dockerize the frontend code 
   - Use a configuration that result in a small image size
   
2. **Create Dockerfile for ExpressJS Backend**:  
   - In the `express-backend` directory, create a `Dockerfile` and dockerize the backend code
   - Make sure the image will be small after building
   
3. **Build Docker Images**:  
   - Build the Angular frontend image 
   - Build the ExpressJS backend image 
   
---

#### **Exercise 3: Set Up Azure Container Registry**  
1. **Create an Azure Container Registry**:  
   - Follow the [Azure Container Registry Quickstart](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal?tabs=azure-cli) to create an Azure Container Registry (ACR).  
   
2. **Push Docker Images to ACR**:  
   - Tag the local frontend image `angular-frontend` with a new tag `<myacr>.azurecr.io/angular-frontend`, preparing it to be pushed to the Azure Container Registry.  
   - Tag the local frontend image `express-backend:flux` with a new tag `<myacr>.azurecr.io/express-backend:flux`, preparing it to be pushed to the Azure Container Registry.
   - Push the tagged images to the Azure Container Registry
   *NOTE: You will need to login to Azure Container Registry using `az acr login` command and the ACR admin credentials. You can learn more about the command here `https://learn.microsoft.com/en-us/cli/azure/acr?view=azure-cli-latest#az-acr-login`. The following article shows how to push an image to the registry if you don't know how `https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli`.*
   
---

#### **Exercise 4: Install and Configure FluxCD**  
1. **Install FluxCD CLI if haven't already**:  
   ```sh  
   choco install flux
   ```
   
2. **Bootstrap FluxCD on Kubernetes**:  
   ```sh  
   flux bootstrap github \  
     --token-auth
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
   
4. **Clone your FluxCD bootstrapped repository**:  
   ```sh  
   git clone https://github.com/<org>/<repository>.git  
   ```
   
---

#### **Exercise 5: Create and Deploy the Applications**  

Inside the root directory of your FluxCD bootstrapped reposity do the following:

1. **Create Kubernetes Deployment and Service Manifests for Angular Frontend**:  
   - Define the deployment manifest (`angular-deployment.yaml`)  
   - Define the service manifest (`angular-service.yaml`) 
   
2. **Create Kubernetes Deployment and Service Manifests for ExpressJS Backend**:  
   - Define the deployment manifest (`express-deployment.yaml`)  
   - Define the service manifest (`express-service.yaml`) 
   
3. **Commit and Push Manifests to GitHub**:  
   ```sh  
   git add angular-deployment.yaml angular-service.yaml express-deployment.yaml express-service.yaml  
   git commit -m "Add deployment and service manifests"  
   git push origin main  
   ```
   
4. **Verify Deployment**:  
   ```sh  
   kubectl get deployments  
   kubectl get services  
   ```
   
---

#### **Exercise 6: Test the Deployed Applications**  
1. **Test Angular Frontend**:  
   - Get the Angular frontend service URL:  
     ```sh  
     kubectl get svc angular-frontend  
     ```
   - Access the Angular frontend application in a browser using the external IP and port.  
   
2. **Test ExpressJS Backend**:  
   - Get the ExpressJS backend service URL:  
     ```sh  
     kubectl get svc express-backend  
     ```
   - Access the ExpressJS backend application in a browser or use `curl` to test the endpoint:  
     ```sh  
     curl http://<external-ip>:<port>  
     ```
   
---

#### **Exercise 7: Integrate OpenTelemetry and Azure Monitor**  
1. **Set Up Application Insights**:  
   - Sign up for an Azure Subscription.  
   - Create a resource group.  
   - Create an Application Insights resource.  

2. **Configure OpenTelemetry in Angular Frontend**:  
   - Install OpenTelemetry packages:  
     ```sh  
     npm install @opentelemetry/api @opentelemetry/sdk-trace-web @opentelemetry/exporter-collector @opentelemetry/instrumentation-document-load @opentelemetry/instrumentation-fetch @opentelemetry/instrumentation-xml-http-request  
     ```
    
   - Configure OpenTelemetry in your Angular application (`main.ts`):  
    
   
3. **Configure OpenTelemetry in ExpressJS Backend**:  
   - Install OpenTelemetry packages:  
     ```sh  
     npm install @opentelemetry/api @opentelemetry/node @opentelemetry/tracing @opentelemetry/exporter-collector @opentelemetry/instrumentation-http  
     ```
    
   - Configure OpenTelemetry in your Express application (`index.js`):  
     
   
4. **Retrieve Connection String**:  
   ```sh  
   az monitor app-insights component show --app <your-app-insights-name> --resource-group <your-resource-group> --query "connectionString" --output tsv  
   ```
   
---

#### **Exercise 8: Monitor the Deployment**  
1. **Set Up Prometheus and Grafana**:  
   - Install Prometheus using Helm:  
     ```sh  
     helm install prometheus stable/prometheus  
     ```
    
   - Install Grafana using Helm:  
     ```sh  
     helm install grafana stable/grafana  
     ```
   
2. **Configure Prometheus to Monitor FluxCD**:  
   - Add Prometheus scrape configuration for FluxCD:  
     ```yaml  
     - job_name: 'flux'  
       static_configs:  
       - targets: ['<flux-pod-ip>:9090']  
     ```
   
3. **Access Grafana Dashboard**:  
   - Port forward Grafana service:  
     ```sh  
     kubectl port-forward svc/grafana 3000:80  
     ```
    
   - Open Grafana in a browser and configure data source to Prometheus.  

To monitor CPU usage, memory usage, and request rates for your ExpressJS backend using Grafana, you need to use Prometheus as the data source. Prometheus collects metrics from your Kubernetes cluster, and you can query these metrics in Grafana to create dashboards.

### Step-by-Step Instructions to Find Metrics and Their Names

1. **Ensure Prometheus is Installed:**
   Make sure Prometheus is installed and configured to scrape metrics from your Kubernetes cluster. If you installed Prometheus using the Helm chart, it should already be set up.

2. **Access Prometheus:**
   Forward the Prometheus service port to your local machine:
   ```sh
   kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090
   ```

   Open Prometheus in a web browser:
   ```sh
   http://localhost:9090
   ```

3. **Explore Metrics in Prometheus:**
   In the Prometheus web UI, you can explore available metrics by typing in the search bar. Here are some common metrics for CPU usage, memory usage, and request rates:

   - **CPU Usage:**
     - `container_cpu_usage_seconds_total`: Total CPU time consumed by the container.
     - `rate(container_cpu_usage_seconds_total[1m])`: CPU usage rate over the last minute.

   - **Memory Usage:**
     - `container_memory_usage_bytes`: Current memory usage of the container.
     - `container_memory_working_set_bytes`: Memory usage excluding cache.

   - **Request Rates:**
     - `http_requests_total`: Total number of HTTP requests received.
     - `rate(http_requests_total[1m])`: HTTP request rate over the last minute.

4. **Add Panels in Grafana:**
   Use these metrics to create panels in Grafana.

### Example Queries for Grafana Panels

1. **CPU Usage Panel:**
   - **Query:**
     ```prometheus
     rate(container_cpu_usage_seconds_total{namespace="default", pod=~"expressjs-backend-.*"}[1m])
     ```
   - **Panel Type:** Graph

2. **Memory Usage Panel:**
   - **Query:**
     ```prometheus
     container_memory_usage_bytes{namespace="default", pod=~"expressjs-backend-.*"}
     ```
   - **Panel Type:** Graph

3. **Request Rates Panel:**
   - **Query:**
     ```prometheus
     rate(http_requests_total{namespace="default", pod=~"expressjs-backend-.*"}[1m])
     ```
   - **Panel Type:** Graph

### Adding Panels in Grafana

1. **Open Grafana:**
   Navigate to `http://localhost:3000` in your web browser and log in.

2. **Create a New Dashboard:**
   - Click on the "+" icon on the left sidebar.
   - Select "Dashboard".
   - Click on "Add new panel".

3. **Add CPU Usage Panel:**
   - In the "Query" section, enter the CPU usage query.
   - Select "Graph" as the panel type.
   - Click "Apply".

4. **Add Memory Usage Panel:**
   - In the "Query" section, enter the memory usage query.
   - Select "Graph" as the panel type.
   - Click "Apply".

5. **Add Request Rates Panel:**
   - In the "Query" section, enter the request rates query.
   - Select "Graph" as the panel type.
   - Click "Apply".

6. **Save the Dashboard:**
   - Click on the "Save" icon at the top.
   - Enter a name for the dashboard and click "Save".

By following these steps, you should be able to find the necessary metrics in Prometheus and create panels in Grafana to monitor CPU usage, memory usage, and request rates for your ExpressJS backend.

---

#### **Exercise 9: Set Up Alerts in Application Insights**  
1. **Create Alerts**:  
   - Navigate to the Alerts section in Application Insights.  
   - Create a new alert rule based on specific metrics (e.g., server response time).  
   
2. **Configure Alert Actions**:  
   - Set up action groups to notify via email or other channels.  
   - You can read the following article to learn how to create an alert if you don't know how to: `https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-metric-alert-rule `
---

#### **Exercise 10: Automate Responses to Alerts**  
1. **Create an Azure Function App:**
   - Go to the Azure Portal.
   - Click on "Create a resource" and search for "Function App".
   - Click "Create" and fill in the required details:
     - Subscription: Select your subscription.
     - Resource Group: Create a new resource group or select an existing one.
     - Function App Name: Enter a unique name for your Function App.
     - Publish: Select "Code".
     - Runtime Stack: Select your preferred runtime (e.g., Node.js, Python, C#).
     - Region: Select the region closest to you.
     - Click "Review + create" and then "Create".

2. **Create a New Function:**
   - Once the Function App is created, go to the Function App in the Azure Portal.
   - Click on "Functions" in the left-hand menu.
   - Click "New Function".
   - Choose a template for your function (e.g., "HTTP trigger").
   - Enter a name for your function and click "Create".

3. **Write the Function Code:**
   - Go to the newly created function.
   - Click on "Code + Test" in the left-hand menu.
   - Write the code to handle alerts and scale the deployment based on alert triggers. For example, you can use the Azure SDK to interact with Kubernetes and scale deployments or send you an email with details of the alert
   
4. **Integrate Azure Functions with Application Insights**:  
   - Go to the Application Insights resource in the Azure Portal.
   - Click on "Alerts" in the left-hand menu.
   - Click "New alert rule".
   - Define the alert condition (e.g., CPU usage, memory usage, request rates).
   - Set the action group to trigger the Azure Function:
     - Click "Create action group".
     - Enter the required details and select "Function App" as the action type.
     - Select the Function App and the specific function you created earlier.
   - Click "Review + create" and then "Create".

5. **Verify the Integration:**
   - Test the setup by triggering an alert condition in Application Insights.
   - Verify that the Azure Function is triggered and performs the scaling operation as expected.
   
---

#### **Exercise 11: Optimize Monitoring Configuration**  
1. **Review and Adjust Metrics**:  
   - Analyze the collected telemetry data.  
   - Adjust the metrics and logging configuration for optimal performance.  
   
2. **Create Custom Dashboards**:  
   - Use Grafana to create custom dashboards for visualizing key metrics.  
   
---

#### **Exercise 12: Analyze Monitoring Data**  
1. **Analyze Performance Data**:  
   - Use Application Insights to analyze performance data and identify bottlenecks.  
   
2. **Generate Reports**:  
   - Create reports based on the monitoring data to share with the team.  
   
---

#### **Exercise 13: Monitor FluxCD with Alerts, Metrics, and Logs**  
1. **Set Up Alerts for FluxCD**:  
   - Follow the instructions on [FluxCD Alerts](https://fluxcd.io/flux/monitoring/alerts/) to set up alerts for FluxCD events.  
   - Create alert rules in Prometheus for FluxCD events and configure alert manager to send notifications.  
   
2. **Monitor FluxCD Metrics**:  
   - Follow the instructions on [FluxCD Metrics](https://fluxcd.io/flux/monitoring/metrics/) to collect and visualize FluxCD metrics.  
   - Add Prometheus scrape configuration for FluxCD metrics and create Grafana dashboards to visualize these metrics.  
   
3. **Create Custom Metrics for FluxCD**:  
   - Follow the instructions on [FluxCD Custom Metrics](https://fluxcd.io/flux/monitoring/custom-metrics/) to create custom metrics for FluxCD.  
   - Implement custom metrics in your FluxCD setup and configure Prometheus to scrape these metrics.  
   
4. **Monitor FluxCD Logs**:  
   - Follow the instructions on [FluxCD Logs](https://fluxcd.io/flux/monitoring/logs/) to collect and analyze FluxCD logs.  
   - Set up a logging solution (e.g., ELK stack) to collect and analyze logs from FluxCD components.  
   
5. **Monitor FluxCD Events**:  
   - Follow the instructions on [FluxCD Events](https://fluxcd.io/flux/monitoring/events/) to monitor FluxCD events.  
   - Configure your monitoring solution to capture and visualize FluxCD events.  
   
6. **Use the Flux Monitoring Example**:  
   - Take advantage of the [fluxcd/flux2-monitoring-example](https://github.com/fluxcd/flux2-monitoring-example) repository to get started with monitoring FluxCD.  
   - Clone the repository and follow the instructions to set up a ready-made example for monitoring FluxCD:  
     ```sh  
     git clone https://github.com/fluxcd/flux2-monitoring-example.git  
     cd flux2-monitoring-example  
     kubectl apply -f ./monitoring  
     ```
   
---

This lab exercise covers the essential steps to set up a comprehensive CI/CD pipeline with FluxCD, integrate monitoring tools, and implement best practices for deployment and monitoring. The hands-on approach ensures that students gain practical experience in managing Kubernetes deployments and monitoring application performance.