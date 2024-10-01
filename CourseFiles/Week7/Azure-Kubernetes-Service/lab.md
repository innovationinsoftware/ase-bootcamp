### Part 1: Introduction and Setup for Azure Kubernetes Service (AKS)

#### Introduction  

##### **Overview of the Lab Objectives**
- Set up an Azure Kubernetes Service (AKS) cluster using Azure CLI.
- Configure kubectl to connect to your AKS cluster.
- Explore the different components of your AKS cluster in the Azure Portal.

##### **Brief on the AKS Architecture**
- **Azure Kubernetes Service (AKS)**: AKS is a fully managed Kubernetes service that simplifies the deployment, management, and scaling of containerized applications. AKS takes care of operational tasks such as health monitoring, scaling, and managing upgrades, while you focus on application development.
- **Azure CLI**: The Azure Command-Line Interface (CLI) is a tool used to create and manage Azure resources. It can be run on your local machine or through a web-based shell in the Azure Portal.

##### **Tools and Technologies Required**
- **Azure CLI**: You will use this tool to create the AKS cluster and manage Kubernetes resources.
- **Azure Subscription**: An active Azure subscription is needed to create the necessary resources for AKS.
- **AKS**: The AKS service will be used to create a Kubernetes cluster, where your containerized applications will run.

#### Environment Setup

##### **Install Azure CLI**
If you have already completed the Key Vault lab, you should have the Azure CLI installed. If not, follow these instructions to install Azure CLI on your system:
- For Windows, Mac, and Linux, refer to the official [Azure CLI installation documentation](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). 

##### **Install kubectl**
Once you have the Azure CLI installed, you will need to install kubectl, the command-line tool used to interact with Kubernetes clusters. Refer to the following links for installation instructions:
- [kubectl for Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
- [kubectl for Mac](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- [kubectl for Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

#### **Create a Resource Group**

Before you create the AKS cluster, ensure that you have a resource group in place. If you don't have one from the previous lab, now is the time to create a new one to organize all the resources related to your AKS cluster. Resource groups serve as logical containers for Azure resources, and their names must be unique within a subscription.

- To create a resource group:
  - Make sure to choose an appropriate name and location for your resource group.
  - Resource groups make it easier to manage and group resources that are related to a specific project or workload.

#### **Create an AKS Cluster**

Now that you have a resource group, it’s time to create an AKS cluster inside it. The AKS cluster is where you will deploy and manage your Kubernetes workloads.

- To create the AKS cluster:
  - Specify important parameters, such as the number of nodes and the resource group.
  - Enable monitoring to track the cluster’s performance, and configure SSH keys if required for secure access.
  - This process may take several minutes to complete. Wait for confirmation that the cluster has been successfully created.

#### **Authenticate to the AKS Cluster**

After the AKS cluster has been created, you need to authenticate `kubectl` to interact with the cluster. In AKS, this involves retrieving the cluster's credentials and configuring `kubectl` to use them.

- To authenticate with the AKS cluster:
  - Use the Azure CLI command `az aks get-credentials` to download the cluster's credentials and configure `kubectl` for access.
  - This command will update your `kubectl` configuration file (`kubeconfig`) with the necessary authentication details for the AKS cluster.
  - Once the credentials are configured, you can use `kubectl` to manage the cluster and deploy applications directly from your terminal.

#### **View the AKS Cluster in the Azure Portal**

Once your AKS cluster is up and running, you can view and manage it through the Azure Portal.

- To view the cluster in the Azure Portal:
  - Open the Azure Portal and navigate to the resource group where the AKS cluster was created.
  - The AKS cluster should be listed there along with other resources.
  - Click on the AKS cluster to explore its components, such as node pools, workloads, services, and monitoring tools.

### Part 2: Deploying a Sample Application with Helm

#### Introduction

##### **Overview of the Lab Objectives**
- Install Helm, a package manager for Kubernetes, on your system.
- Add a Helm repository to access pre-built charts.
- Deploy a sample application using Helm.
- Verify the successful deployment of the application in your AKS cluster.

##### **Install Helm**
If Helm is not already installed on your system, follow the instructions on the official Helm website to install it:
- For Windows, Mac, and Linux, refer to the Helm installation guide at [Helm Official Website](https://helm.sh/docs/intro/install/).

##### **Add a Helm Repository**
Once Helm is installed, add the Bitnami chart repository. After adding the repository, update your local cache to ensure you have the latest charts available.

#### Deploy a Sample Application

#### **Deploy WordPress Using Helm**

You will deploy WordPress using a Helm chart from the Bitnami repository you added earlier. This is a quick and easy way to deploy an application to your AKS cluster.

- **Steps to Deploy the WordPress Application:**
  - Deploy the WordPress chart from the Bitnami repository using Helm.
  - Specify a **release name** for the deployment and include any necessary configuration parameters, such as resource limits or storage options.

##### **Verify the Deployment**
Once you’ve deployed WordPress, you will need to verify that the deployment was successful:
- List the pods running in your default namespace, and check that the WordPress pods are up and running.
- Confirm that the persistent volumes and services are correctly set up to support the application.
- Wait until all WordPress pods reach the `Running` state before proceeding to the next steps.

##### **Retrieve the Service Information**
- To access the WordPress application, you will need to retrieve the external IP address of the service:
  - The service will provide access to the application by exposing the necessary ports for HTTP and HTTPS traffic.
  - Use `kubectl` to get the details of the WordPress service, including its external IP or load balancer URL.

##### **Access the WordPress Application**
Once the service is up and running, you can access the application:
- Open a web browser and navigate to the external IP address or URL provided by the service.
- You should be able to view the WordPress installation page, where you can configure the application and begin using it.
- Verify that the application is functional by navigating through the default pages and performing basic operations.

##### **Explore the Application**
- Take some time to explore the deployed WordPress application.
  - Try adding new posts or customizing the theme to ensure that the application is fully operational.
  - Check the underlying Kubernetes resources, such as pods, services, and persistent volumes, to gain a better understanding of how Helm deploys applications in Kubernetes.

### Part 3: Scaling the WordPress Application

#### Introduction

##### **Overview of the Lab Objectives**
- Learn how to manually scale a Kubernetes deployment in AKS.
- Understand how scaling impacts the performance and availability of the application.
- Verify the scaling process and observe the changes in the AKS cluster.

#### **Scaling the Application**

##### **Check the Current Number of Pods**
Before you begin scaling, it’s important to check the current state of the WordPress application. Review the number of pods that are currently running in the cluster. This will provide a baseline for comparison after the scaling process is completed.

- To check the current number of pods:
  - List all running pods associated with the WordPress application.
  - Make note of the number of pods and their statuses to see how the cluster is handling the current workload.

##### **Scale the Deployment**
Scaling the WordPress deployment increases the number of replicas, which adds more pods to handle the load and improves the application’s availability and resilience. This step helps distribute traffic across multiple pods.

- To scale the deployment:
  - Increase the number of replicas based on your application’s needs and the expected traffic.
  - Adding more replicas allows your cluster to better handle increased demand, ensuring smoother performance during peak times.

##### **Verify the Scaling**
Once the scaling process is complete, you will need to verify that the new pods have been created and are running as expected.

- To verify the scaling:
  - List the pods again to confirm that the desired number of replicas are now in the `Running` state.
  - Check for any issues or delays in pod creation, ensuring that the scaling operation has been successful.

##### **Scale Back the Deployment**
After completing the scaling operation, you may want to reduce the number of replicas to conserve resources when the extra capacity is no longer needed. This helps optimize resource usage within your AKS cluster.

- To scale back the deployment:
  - Reduce the replica count to a lower number based on your resource requirements.
  - Verify that the excess pods are properly terminated and that the deployment adjusts to the new replica count.

### Part 4: Debugging the WordPress Application

#### Introduction

##### **Overview of the Lab Objectives**
- Simulate a failure in the WordPress deployment to understand how to debug issues in Kubernetes.
- Utilize Kubernetes tools to identify the root cause of the failure.
- Resolve the issue and restore the application to its normal state.

#### **Simulate a Failure**

##### **Scale the Deployment to Zero Replicas**
To begin simulating a failure, reduce the number of replicas in the WordPress deployment to zero. This will effectively stop the application by terminating all of the running pods associated with it.

- To simulate the failure:
  - Scale the WordPress deployment down to zero replicas.
  - Verify that no WordPress pods are running in the cluster by listing the pods and confirming they have been terminated.

##### **Introduce an Error in the Deployment**
Next, introduce a configuration error by modifying the WordPress deployment to use an invalid image name. This will cause any future pod creation attempts to fail, simulating a real-world issue where incorrect configurations lead to deployment failures.

- To introduce the error:
  - Edit the deployment and change the image to an invalid or non-existent name.
  - This will prevent the pods from being created successfully, causing them to enter either a `CrashLoopBackOff` or `ImagePullBackOff` state when the deployment is scaled back up.

##### **Scale the Deployment to One Replica**
After introducing the error, scale the deployment back up to one replica. This will allow you to observe the failure scenario as the new pod creation fails due to the invalid image.

- To observe the failure:
  - Scale the deployment to one replica and monitor the pod creation process.
  - Verify that the pod fails to start and enters the error state, effectively simulating a failure due to misconfiguration.

### Part 5: Monitoring the AKS Workload

#### Introduction

##### **Overview of the Lab Objectives**
- Learn how to monitor the AKS cluster and its workloads using Azure’s monitoring tools.
- Use Log Analytics to view logs and metrics from your deployed applications.
- Understand how to set up alerts and monitor pod health in AKS.

#### **Monitoring the Application**

##### **Access the Monitoring Dashboard**
To monitor the health and performance of your AKS cluster, log into the Azure Portal and navigate to the Log Analytics workspace associated with your AKS deployment. This workspace provides a centralized view of logs, metrics, and insights collected from your cluster and its workloads.

- To access the dashboard:
  - Open the Azure Portal and locate the Log Analytics workspace linked to your AKS cluster.
  - Explore the logs, performance metrics, and available insights for deeper visibility into the cluster's operations.

##### **View Pod Error Logs in Azure Portal**
In the Log Analytics workspace, you can query logs related to pod failures or errors that occurred within your AKS cluster. Specifically, you can filter for events such as `ImagePullBackOff` or `CrashLoopBackOff`, which indicate issues with pod deployment or image pulling.

- To view error logs:
  - Use Kusto Query Language (KQL) to query for pod errors based on status reasons like `ImagePullBackOff` or `CrashLoopBackOff`.
  - These logs will help you identify the root cause of failures and allow you to take corrective action.

### Part 6: Integrating Azure Key Vault with AKS

#### Introduction

##### **Overview of the Lab Objectives**
- Integrate AKS with Azure Key Vault to securely manage secrets, keys, and certificates for your applications.
- Use Managed Identity to securely authenticate your AKS cluster with Azure resources.
- Retrieve secrets from Azure Key Vault and inject them into your Kubernetes workloads.

#### **Set Up Azure Key Vault**

##### **Create and Configure the Azure Key Vault**
Ensure that an Azure Key Vault is set up and configured with all the necessary secrets that your application will use. These secrets might include sensitive information such as API keys, database connection strings, or credentials required for accessing third-party services.

- To configure the Key Vault:
  - Create a new Key Vault in Azure if one doesn’t exist.
  - Store any required secrets in the vault, ensuring proper access policies and permissions are set to protect the sensitive data.

#### **Enable Managed Identity for AKS**

##### **Enable Managed Identity on the AKS Cluster**
Configure your AKS cluster to use Managed Identity, allowing it to securely authenticate with Azure resources, including Azure Key Vault, without needing to manage credentials within the code or environment variables. This provides a secure and streamlined way for AKS to access secrets.

- To enable Managed Identity:
  - Update the AKS cluster configuration to use Managed Identity, ensuring it can interact with Azure services, including Key Vault.
  - Verify that the identity is correctly assigned to the AKS cluster.

#### **Assign Key Vault Administrator Role to Managed Identity**

##### **Assign the Key Vault Role**
Grant the Managed Identity of the AKS cluster the appropriate permissions by assigning it the `Key Vault Administrator` role. This role allows the AKS cluster to access and manage secrets within the Key Vault securely.

- To assign the role:
  - Retrieve the Managed Identity object ID from the AKS cluster.
  - Assign the `Key Vault Administrator` role to this identity for the Azure Key Vault, ensuring it has the necessary permissions.

#### **Install the Azure Key Vault Provider for Secrets Store CSI Driver**

##### **Install the CSI Driver**
Install the Secrets Store CSI Driver for Azure Key Vault within your AKS cluster. This driver allows Kubernetes pods to securely pull secrets from the Key Vault and mount them as files or environment variables inside the containers, making it easier to access the secrets.

- To install the driver:
  - Add the Azure Key Vault provider for Secrets Store CSI Driver to your AKS cluster.
  - Ensure the driver is correctly configured to work with the Key Vault and AKS.

#### **Create a SecretProviderClass**

##### **Define a SecretProviderClass Resource**
Create a `SecretProviderClass` resource in Kubernetes. This resource defines how and which secrets should be accessed from Azure Key Vault. It includes information such as the Key Vault name, the secrets to be retrieved, and how they should be made available within the AKS pods.

- To configure `SecretProviderClass`:
  - Define the Key Vault details, including the secrets to pull and whether they should be mounted as files or exposed as environment variables.
  - Apply the `SecretProviderClass` resource to your Kubernetes cluster, enabling seamless secret retrieval from Azure Key Vault.

### Lab Completion

Congratulations! You have successfully completed the lab, and now have the following skills:
- Set up and configured an AKS cluster in Azure.
- Deployed a sample application using Helm.
- Scaled the application to handle increased load and optimized resource usage.
- Debugged and resolved application failures using Kubernetes tools.
- Monitored and managed the health of your AKS workloads using Azure Monitor.
- Integrated AKS with Azure Key Vault to securely manage secrets and sensitive data.

Continue exploring further labs and exercises to deepen your understanding of AKS and Kubernetes management.