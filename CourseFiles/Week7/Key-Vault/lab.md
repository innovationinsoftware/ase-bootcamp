# Key Vault

### Part 1: Introduction and Setup  

#### Introduction  

##### **Overview of the Lab Objectives**  
- Set up an Azure Key Vault using Azure CLI.
- Store and manage secrets, keys, and certificates in the Key Vault.
- Apply best practices for securing and accessing the Key Vault.
- Integrate the Key Vault with other Azure services.

##### **Brief on the Key Vault Architecture**  
- **Azure Key Vault**: Centralized cloud service for storing application secrets, keys, and certificates securely.
- **Azure CLI**: Command-line tool for managing Azure resources.

##### **Tools and Technologies Required**  
- **Azure CLI**: Command-line tool for managing Azure resources.
- **Azure Subscription**: Required to create and manage Azure resources.
- **Key Vault**: Azure service for managing secrets, keys, and certificates.

#### Environment Setup

##### **Install Azure CLI**  
**Azure CLI Installation**  
   - Follow the instructions from the official Azure website to install Azure CLI on your system:  
     - [Azure CLI for Windows](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows)  
     - [Azure CLI for Mac](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-macos)  
     - [Azure CLI for Linux](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux)  

##### **Verify Installation**  
- Open a terminal or command prompt and run:  
  ```bash  
  az --version
  ```

- You should see output indicating the installed version of Azure CLI.  

##### **Login to Azure and Select Subscription**

```bash
az login
```

- Use AZ CLI to log in to your Azure account. After logging in, you will see a list of available subscriptions and a prompt to select a subscription. Select the one specified by your instructor.

##### **Verify Current Tenant and Subscription**

```bash
az account show
```

- This command displays the details of the currently selected subscription and tenant. Verify that the correct subscription and tenant are selected.

#### Create a Key Vault 

##### **Create a Resource Group**  
- Create a resource group to hold your Key Vault
- Resource Groups need to be unique within a subscription. If you receive an error message about a naming conflict. Simply try another name for your resource group and attempt to create it again.

##### **Create a Key Vault**  
Create a Key Vault in the resource group. Note: Key Vault names must be globally unique, which means 
no two Key Vaults in the world can have the same name. To ensure this, append your initials and a unique 
number to the Key Vault name.

- If the command fails due to the name being taken, modify the number or name slightly and try again.
- Key Vault names can contain alphanumeric characters (letters and numbers) and hyphens, but they must start and end with a letter or number and be between 3 and 24 characters long.
- Once the Key Vault has been created, view it in the Azure Portal

### Part 2: Creating and Retrieving Keys

#### Introduction

##### **Overview of the Lab Objectives**
- Attempt to create a key in the Azure Key Vault.
- Understand the role-based access control (RBAC) requirements for managing keys.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve keys from the Key Vault.

#### Assign Roles

##### Attempt to Create a Key in the Key Vault

- First, try to create a key inside your Key Vault. If you haven’t been assigned the correct role, this operation will fail.

Tip: If this step fails, it indicates you lack the necessary permissions, and the next step will show you how to assign them.

##### Assign the Key Vault Crypto Officer Role

- Assign the Key Vault Crypto Officer role to yourself, which gives you permission to create and manage keys.

Hint: Before assigning the role, ensure you have the Object ID of your user and the Subscription ID available.

##### Verify Role Assignment

- After assigning the role, verify that it has been applied correctly.

#### Create and Retrieve Keys

##### **Create a Key**
- Now that the appropriate role has been assigned, attempt to create a key in your Key Vault. You will need to decide on the key type (e.g., RSA) and the key size.

**Hint**: Make sure to also define the cryptographic operations (e.g., encrypt, decrypt, sign) that the key can perform.


##### **Retrieve the Key**
- After successfully creating the key, retrieve it to confirm that it has been stored correctly.

**Tip**: When retrieving keys, always ensure they are handled securely, as they are sensitive pieces of data.

##### **Confirm Key Creation in the Azure Portal**
- Visit the **Azure Portal** again, navigate to your Key Vault, and check the "Keys" section. You should see your newly created key listed there.


### Part 3: Creating and Retrieving Secrets

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the role-based access control (RBAC) requirements for managing keys.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve secrets from the Key Vault.
- Create a new version of your secret.

#### Assign Roles

##### Assign the Appropriate RBAC Role

- You’ll need to assign a specific role to manage secrets within the Key Vault. Determine the minimal permissions required for your task and assign the role to yourself.

**Hint**: Refer to the Azure documentation to identify the most appropriate role for secret management

#### Create and Retrieve Secrets

##### **Create a Secret**
- Once the role is assigned, create a new secret in the Key Vault. Add a description, some tags, and set the content type to "text/plain".

**Hint**: Secrets can include passwords, connection strings, or other sensitive information.

##### **Retrieve the Secret**
- After storing the secret, retrieve it using Azure CLI to confirm that it has been saved correctly.
- Ensure the value of the secret is displayed on the output of the command.

**Tip**: Ensure that the secret’s output is handled securely to avoid exposing sensitive data.

##### **Confirm Secret Creation in the Azure Portal**
- As with keys, navigate to the **Secrets** section in the Azure Portal and confirm that your secret is listed.

#### Secret Version Management

##### Create a New Version of the Secret

- Determine how to create a new version of your secret using either the Azure portal or the Azure CLI.
- Verify the creation of the new version by viewing both the current and previous versions of the secret in your Key Vault.
- Use the Azure CLI to retrieve the older version of the secret to confirm its availability and integrity.

#### Additional Secret Management Tasks

- **Backup:** Download a backup of your secret to ensure you have a copy available in case of accidental deletion.
- **Delete:** Remove the secret from your Key Vault using the Azure Portal. Confirm that it has been removed from the list of secrets.
- **Restore Attempt:** Attempt to restore the secret from the backup file. If this fails, investigate whether the secret has been permanently deleted or if other issues are preventing the restoration.
- **Restore:** Successfully restore the deleted secret using the backup, and verify that it appears correctly in the Key Vault.

**Tip:** Always verify the secret’s status and versions before and after performing management tasks to ensure data integrity and security.

### Part 4: Creating and Retrieving Certificates

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the role-based access control (RBAC) requirements for managing certificates.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve certificates from the Key Vault.
- Create a new version of your certificate.

##### Assign the Appropriate RBAC Role

- Refer to the Azure documentation to identify the role that grants permissions to create Key Vault secrets.
  
- Use the Azure CLI to assign this role to your user account. Ensure that you adhere to the **Principle of Least Privilege** by selecting the minimal permissions required for your tasks.

**Note:** Always review and verify the permissions associated with each role to ensure secure and appropriate access control.

##### **Verify Role Assignments**
- Check that the role has been correctly assigned to your user by listing their role assignments.

*Hint: Use commands to list role assignments and confirm the permissions.*

##### Create a policy.json file

```json
{
  "issuerParameters": {
    "name": "Self"
  },
  "keyProperties": {
    "exportable": true,
    "keySize": 2048,
    "keyType": "RSA",
    "reuseKey": true
  },
  "lifetimeActions": [
    {
      "action": {
        "actionType": "AutoRenew"
      },
      "trigger": {
        "daysBeforeExpiry": 30
      }
    }
  ],
  "secretProperties": {
    "contentType": "application/x-pem-file"
  },
  "x509CertificateProperties": {
    "extendedKeyUsage": ["1.3.6.1.5.5.7.3.1"],
    "keyUsage": [
      "cRLSign",
      "dataEncipherment",
      "digitalSignature",
      "keyEncipherment",
      "keyAgreement",
      "keyCertSign"
    ],
    "subject": "CN=example.com",
    "validityInMonths": 12
  }
}
```
- This policy file defines the properties of the certificate, including the key type, key size, subject, and validity period.

##### **Retrieve the Certificate**
- Retrieve the certificate details from your Key Vault to verify its creation and configuration.

*Hint: Use Azure CLI commands to display certificate details.*

##### **Verify the Certificate in the Azure Portal**
1. Go to the Azure Portal and navigate to your Key Vault.
2. Check the **Certificates** section to confirm that the certificate is listed and view its details.

##### **Export the Certificate**

- Use AZ CLI to export the certificate to your local machine in '.pem' format.

##### **Convert the Certificate to PFX Format**
- Use OpenSSL or another tool to convert the PEM-formatted certificate to PFX format, commonly used for importing into various applications.

*Hint: Ensure you have the necessary tools installed for certificate conversion.*

##### **Confirm the Exported Certificate**
- View the exported certificate file using a certificate management tool to ensure it matches the original properties set in the Key Vault.

### Part 5: Auditing Key Vault Activity

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the importance of auditing Key Vault activity for security and compliance.
- Enable Azure Monitor for Key Vault to capture activity logs.
- Configure Diagnostic Logs for detailed insights into Key Vault operations.
- Analyze logs using Azure Monitor to identify and respond to potential security issues.

##### Create a Log Analytics Workspace

```bash
az monitor log-analytics workspace create --resource-group myResourceGroup --workspace-name myWorkspace --location eastus
```

- This command creates a Log Analytics workspace named `myWorkspace` in the resource group `myResourceGroup` and location `eastus`.

##### **Enable Diagnostic Logging for Key Vault**

- Set up a diagnostic setting for your Key Vault, linking it to your Log Analytics workspace. As part of this, ensure you enable the ‘AuditEvent’ log category to capture audit events such as key operations and access attempts
- This will allow you to monitor and review key activities within your Key Vault. You’ll need to specify the Key Vault resource and the Log Analytics workspace during the configuration.

##### Additional Logging tasks

- **Kusto Query:** Construct a Kusto query in your Log Analytics workspace that filters all Key Vault audit activity. Make sure to scope it specifically to the Key Vault you created to isolate relevant events.
  
- **Backup and Restore:** Perform a backup and restore operation on a Key Vault item. Rerun your query to check for any new events related to these activities.

- **Enable Log Categories:** Update the diagnostic settings for your Key Vault to include the 'Request' and 'Errors' log categories. Perform actions like creating or deleting keys to generate new log entries.

- **Refine Your Query:** Rerun your query, this time focusing on the new log categories. Observe and analyze the changes in log data to better understand how different activities are logged in Key Vault.

**Note:** Regularly review and update your diagnostic settings and queries to ensure comprehensive monitoring and auditing of Key Vault activities.

### Part 6: Network Isolation for Azure Key Vault

#### **Introduction**
Network isolation is crucial for securing Azure Key Vault by restricting access to specific virtual networks and IP addresses. This ensures that only authorized resources can access your Key Vault, reducing the risk of unauthorized data access.

##### **Steps to Implement Network Isolation**

##### **1. Disable Access from Public Networks**

Disabling public network access helps prevent any unauthorized access attempts from outside your designated network.

**Disable Public Network Access:**
- Go to your Key Vault in the Azure Portal.
- Navigate to the **Networking** section.
- Remove public access.

*Note: After making this change, all public access to your Key Vault will be blocked.*

**Test Access Restrictions:**
- Attempt to access Key Vault resources, such as secrets or certificates, from a public network.
- Verify that access is denied.

##### **2. Enable Public Network Access with Restrictions**

If you need limited public access, you can configure the Key Vault to allow only specific IP addresses.

**Get Your Public IP Address:**
- Retrieve your public IP address.
- Record the IP address for use in the next step.

**Enable Public Network Access with Restrictions:**
- Enable public network access on your Key Vault.
- Set the network configuration to allow only your recorded IP address.
- Save the changes.

**Verify Configuration:**
- Access the Key Vault from your allowed IP address.
- Check in the Azure Portal under the **Networking** section to see your IP listed with a status of **Allow**.

##### **3. Deleting the Key Vault**

Deleting a Key Vault can sometimes generate errors. Follow these steps to troubleshoot:

**Attempt to Delete the Key Vault:**
- Try deleting the Key Vault through the Azure Portal or Azure CLI.

**Troubleshoot Deletion Errors:**
- If you encounter errors, review the errors generated and determine the reason for failure.
- Make necessary adjustments.
- Delete the Key Vault.

### Part 7: Creating Key Vault with Terraform

#### **Introduction**
In this part, you'll learn how to automate the creation and management of Azure Key Vault using Terraform. By leveraging Infrastructure as Code (IaC), you can ensure consistent, repeatable deployments across your environments.

##### **Terraform Installation**

```bash
choco install terraform
```

**Note:** If you don't have Chocolatey installed, you can follow the instructions at chocolatey.org/install.

##### **Setup and Configuration**

##### **1. Configure Backend Storage**
Create an Azure Storage Account to store the Terraform state file. This ensures that your state is maintained centrally and can be shared among multiple collaborators.

##### **2. Create the Key Vault Resource**
Use the `azurerm_key_vault` resource in Terraform to define your Key Vault. This resource should include specifications like name, resource group and location.

*Hint: Define RBAC roles and assignments to manage permissions for different users and services.*

##### **3. Enable Purge Protection**
Once the Key Vault is created, enable Purge Protection using your existing Terraform configuration. This feature prevents permanent deletion of the Key Vault or its contents, adding an extra layer of security.

##### **4. Optional: Create Certificates, Secrets, and Keys**
Optionally, use Terraform to create and manage certificates, secrets, and keys in your Key Vault. This enables centralized management of sensitive information in your infrastructure.


### Lab Completion

Congratulations! You have successfully completed the lab. You have learned how to:

- Set up and configure Azure Key Vault to securely store and manage sensitive information.
- Implement and manage role-based access control (RBAC) to control permissions for Key Vault resources.
- Use Terraform to automate the creation and configuration of Key Vaults, including enabling features like purge protection.
- Create and manage secrets, certificates, and keys within Key Vault.
- Secure access to Key Vault by enabling network isolation and restricting access to specific virtual networks and IP addresses.

Explore further labs or exercises to continue expanding your knowledge of Azure Key Vault and related security features.

