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

- Use the Azure CLI to log in to your Azure account. After logging in, you will see a list of available subscriptions and a prompt to select a subscription. Select the one specified by your instructor.

##### **Verify Current Tenant and Subscription**

```bash
az account show
```

- This command displays the details of the currently selected subscription and tenant. Verify that the correct subscription and tenant are selected.

#### Create a Key Vault 

##### **Create a Resource Group**  
- Create a resource group to hold your Key Vault:  
  ```bash  
  az group create --name myResourceGroup --location eastus  
  ```

##### **Create a Key Vault**  
Create a Key Vault in the resource group. Note: Key Vault names must be globally unique, which means 
no two Key Vaults in the world can have the same name. To ensure this, append your initials and a unique 
number to the Key Vault name. For example:

```bash  
az keyvault create --name myKeyVaultAN01624 --resource-group myResourceGroup --location eastus --enable-rbac-authorization
```

##### **Key Vault Naming Instructions** 
- Replace `myKeyVaultAN01624` with a unique name by adding your initials and a number.
- If the command fails due to the name being taken, modify the number or name slightly and try again.
- Key Vault names can contain alphanumeric characters (letters and numbers) and hyphens, but they must start and end with a letter or number and be between 3 and 24 characters long.

##### **View the Key Vault in the Azure Portal**  
- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Resource groups" in the left-hand menu.
- Select the resource group `myResourceGroup`.
- Click on the Key Vault to view its details.

![alt text](images/Part1.png)

### Part 2: Creating and Retrieving Keys

#### Introduction

##### **Overview of the Lab Objectives**
- Attempt to create a key in the Azure Key Vault.
- Understand the role-based access control (RBAC) requirements for managing keys.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve keys from the Key Vault.

#### Assign Roles

##### Attempt to Create a Key in the Key Vault

  ```bash
  az keyvault key create --vault-name <key-vault-name> --name myKey --protection software --kty RSA --size 2048 --ops encrypt decrypt sign verify
  ```
  - Replace `<key-vault-name>` with the name of your key vault.
  - **Note:** This command will fail unless the user has the appropriate RBAC role assigned, such as the **Key Vault Crypto Officer** role.


##### Assign Key Vault Crypto Officer Role to the Currently Logged-In User

To assign the Key Vault Crypto Officer role to the currently logged-in user, follow these steps:

##### Get the Currently Logged-In User's Object ID, and the Current Subscription ID

```bash
az ad signed-in-user show --query id --output tsv
az account show --query id --output tsv
```

- These commands retrieve the object ID of the currently logged-in user and the current Subscription ID. Note down the IDs returned by the commands.


##### Assign The Key Vault Crypto Officer Role

```bash
az role assignment create --role "Key Vault Crypto Officer" --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name>
```

- Replace `<user-object-id>` with the object ID obtained from the previous step.
- Replace `<subscription-id>` with your Azure subscription ID.
- Replace `<key-vault-name>` with the name of your key vault.
- This command assigns the Key Vault Crypto Officer role to the currently logged-in user for the Key Vault.


##### Verify Role Assignment

```bash
az role assignment list --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name> --output table
```

- Replace `<user-object-id>` with the object ID obtained earlier.
- Replace `<subscription-id>` with your Azure subscription ID.
- Replace `<key-vault-name>` with the name of your key vault.
- This command lists the role assignments for the specified user and scope, allowing you to verify that the Key Vault Crypto Officer role has been assigned.

#### Create and Retrieve Keys

##### Create a Key

  ```bash
  az keyvault key create --vault-name <key-vault-name> \
  --name myKey \
  --protection software \
  --kty RSA \
  --size 2048 \
  --ops encrypt decrypt sign verify
  ```
  - Replace `<key-vault-name>` with the name of your key vault.
  - **Note:** This command should now work, now that your identity has been assigned the **Key Vault Crypto Officer** role.


##### Retrieve the Key

- Use the Azure CLI to retrieve the key from the Key Vault:
  ```bash
  az keyvault key show --vault-name <key-vault-name> --name myKey
  ```

##### Confirm Key Creation in the Azure Portal
- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Resource groups" in the left-hand menu.
- Select the resource group `myResourceGroup`.
- Click on the Key Vault.
- In the Key Vault, navigate to "Keys" under the "Objects" section.
- Confirm that the key `myKey` is listed.
- Click on the key `myKey` to view its details.
- Click on the current version.
- Under the "Key operations" section, confirm that the operations `encrypt`, `decrypt`, `sign`, and `verify` are listed.

![alt text](images/Part2.png)

### Part 3: Creating and Retrieving Secrets

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the role-based access control (RBAC) requirements for managing keys.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve secrets from the Key Vault.
- Create a new version of your secret.

#### Assign Roles

##### Assign The Key Vault Secrets Officer Role

```bash
az role assignment create --role "Key Vault Secrets Officer" --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name>
```

- This command assigns the Key Vault Secrets Officer role to the currently logged-in user for the Key Vault.

##### Verify Role Assignments

```bash
az role assignment list --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name> --output table
```

- This command lists the role assignments for the specified user and scope, allowing you to verify that both the Key Vault Crypto Officer and Key Vault Secrets Officer roles have now been assigned.

#### Create and Retrieve Secrets

##### Create a Secret

  ```bash
az keyvault secret set \
  --vault-name <key-vault-name> \
  --name mySecret \
  --value "mySecretValue" \
  --description "This is a test secret with additional options" \
  --tags env=test \
  --content-type "text/plain"
  ```

- This command creates a secret with the value mySecretValue, a description, tags it with env=test, and sets the content type to text/plain.

##### Retrieve the Secret

  ```bash
  az keyvault secret show --vault-name <key-vault-name> --name mySecret --query value
  ```
- Replace `<key-vault-name>` with the name of your key vault.

##### Confirm Secret Creation in the Azure Portal
- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Resource groups" in the left-hand menu.
- Select the resource group `myResourceGroup`.
- Click on the Key Vault.
- In the Key Vault, navigate to "Secrets" under the "Settings" section.
- Confirm that the secret `mySecret` is listed.
- Click on the secret `mySecret` to view its details.
- Click on the current version.
- Click `Show Secret Value`

![alt text](images/Part3-a.png)

##### Create a New Version of the Secret

  ```bash
  az keyvault secret set --vault-name <key-vault-name> --name mySecret --value "myNewSecretValue"
  ```
- This command creates a new version of the secret mySecret with the value myNewSecretValue.

##### Confirm New Version in the Azure Portal
- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Resource groups" in the left-hand menu.
- Select the resource group `myResourceGroup`.
- Click on the Key Vault `myKeyVault`.
- In the Key Vault, navigate to "Secrets" under the "Settings" section.
- Confirm that the secret `mySecret` is listed.
- Click on the secret `mySecret` to view its details.
- Click on the Current version
- Confirm that the new version with the value `myNewSecretValue` is listed.
- **Note:** Key vault maintains versioned secrets. Click on the older version to view the old secret value
- **Note:** Take a look at the content type and tags on both versions of the secrets.
- **Note:** The new version can take a minute or two to display in the portal. Keep refreshing the page until the new version appears.

![alt text](images/Part3-b.png)

#### Additional Secret Management Tasks

### **Backup a Secret**

To back up a secret from your Key Vault to a local file:

```bash
az keyvault secret backup --vault-name <your-key-vault-name> --name <your-secret-name> --file <path-to-backup-file>
```

- Replace `<your-key-vault-name>` with the name of your Key Vault.
- Replace `<your-secret-name>` with the name of the secret.
- Replace `<path-to-backup-file>` with the local file path where you want the backup saved.

---

### **Delete a Secret**

To delete a secret (this will move it to the "soft delete" state):

```bash
az keyvault secret delete --vault-name <your-key-vault-name> --name <your-secret-name>
```

- Replace `<your-key-vault-name>` with the name of your Key Vault.
- Replace `<your-secret-name>` with the name of the secret.

You can check the deleted secret with:

```bash
az keyvault secret list-deleted --vault-name <your-key-vault-name>
```

---

### **Restore Attempt (from Backup)**

To attempt a restore of a secret from the backup file:

```bash
az keyvault secret restore --vault-name <your-key-vault-name> --file <path-to-backup-file>
```

- Replace `<your-key-vault-name>` with the name of your Key Vault.
- Replace `<path-to-backup-file>` with the path to the backup file created earlier.

**Note:** This will likely fail with an error similar to:
> "Secret already exists in a deleted state"  
This happens because the secret is still in the "soft delete" state. You'll need to purge or restore it from the deleted state first.

---

### **Restore a Soft-Deleted Secret**

If soft delete is enabled, restore the secret from the deleted state:

```bash
az keyvault secret recover --vault-name <your-key-vault-name> --name <your-secret-name>
```

- Replace `<your-key-vault-name>` with the name of your Key Vault.
- Replace `<your-secret-name>` with the name of the deleted secret.

---

### **Purge a Deleted Secret (Permanent Deletion)**

If you want to completely delete a secret (purge it):

```bash
az keyvault secret purge --vault-name <your-key-vault-name> --name <your-secret-name>
```

**Note:** Once purged, the secret is permanently deleted and **cannot be restored**.

---

### **Successfully Restore from Backup (After Purging)**

If you’ve purged the deleted secret or if the soft-deleted secret has expired, you can now restore the backup:

```bash
az keyvault secret restore --vault-name <your-key-vault-name> --file <path-to-backup-file>
```

This will restore the secret from the backup file to your Key Vault.

---

Let me know if you need further assistance!

### Part 4: Creating and Retrieving Certificates

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the role-based access control (RBAC) requirements for managing certificates.
- Assign the appropriate RBAC role to the currently logged-in user.
- Successfully create and retrieve certificates from the Key Vault.
- Create a new version of your certificate.

#### Assign Roles

##### Assign The Key Vault Certificates Officer Role

```bash
az role assignment create --role "Key Vault Certificates Officer" --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name>
```

- This command assigns the Key Vault Secrets Officer role to the currently logged-in user for the Key Vault.

##### Verify Role Assignments

```bash
az role assignment list --assignee <user-object-id> --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<key-vault-name> --output table
```

- This command lists the role assignments for the specified user and scope, allowing you to verify that the Key Vault Crypto Officer, the Key Vault Secrets Officer and the Key Vault Certificates Officer roles have now been assigned.

#### Create and Retrieve Secrets

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

##### **Create a Certificate**

```powershell
az keyvault certificate create `
  --vault-name KeyVaultjrs `
  --name myCertificate `
  --policy @C:\Users\ase-instructor\policy.json
```

- This command creates a certificate named `myCertificate` in the Key Vault using the policy defined in the `policy.json` file.

##### **Retrieve the Certificate**

```bash
az keyvault certificate show --vault-name <key-vault-name> --name myCertificate
```

- This command retrieves the details of the certificate named `myCertificate` from the Key Vault `<key-vault-name>`.

#### Confirm Certificate Creation in the Azure Portal

##### **View the Certificate in the Azure Portal**
- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Resource groups" in the left-hand menu.
- Select the resource group `myResourceGroup`.
- Click on the Key Vault.
- In the Key Vault, navigate to "Certificates" under the "Settings" section.
- Confirm that the certificate `myCertificate` is listed.
- Click on the certificate `myCertificate` to view its details.
- Click on the current version.
- Under the "Properties" section, confirm that the certificate properties are correctly set.

![alt text](images/Part4-a.png)

#### Export the Certificate

##### **Export the Certificate**

```bash
az keyvault certificate download --vault-name <key-vault-name> --name myCertificate --file myCertificate.pem
```

- This command exports the certificate named `myCertificate` from the Key Vault to a file named `myCertificate.pem`.

### Part 5: Auditing Key Vault Activity

#### Introduction

##### **Overview of the Lab Objectives**
- Understand the importance of auditing Key Vault activity for security and compliance.
- Enable Azure Monitor for Key Vault to capture activity logs.
- Configure Diagnostic Logs for detailed insights into Key Vault operations.
- Analyze logs using Azure Monitor to identify and respond to potential security issues.

#### Create a Log Analytics Workspace

##### **Create a Log Analytics Workspace**

```bash
az monitor log-analytics workspace create --resource-group myResourceGroup --workspace-name myWorkspace --location eastus
```

- This command creates a Log Analytics workspace named `myWorkspace` in the resource group `myResourceGroup` and location `eastus`.

#### Enable Diagnostic Logging

##### **Enable Diagnostic Logging for Key Vault**

```powershell
az monitor diagnostic-settings create `
--resource "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<vault-name>" `
--name "keyvault-diagnostics" `
--logs '[{"category":"AuditEvent","enabled":true}]' `
 --workspace "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.OperationalInsights/workspaces/myWorkspace"
```

- This command enables diagnostic logging for the Key Vault and sends the logs to the Log Analytics workspace `myWorkspace`.

#### View Audit Logs in Azure Portal

##### **View Audit Logs**

- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Log Analytics workspaces" in the left-hand menu.
- Select the workspace `myWorkspace`.
- In the workspace, navigate to "Logs" under the "General" section.
- Use the following query to view Key Vault audit logs:

```kusto
AzureDiagnostics
| where ResourceType == "VAULTS" and Category == "AuditEvent"
| project TimeGenerated, OperationName, ResultType, ResourceId
```

![alt text](images/Part5-a.png)

- This query filters the logs to show only Key Vault audit events and displays relevant information such as the time of the event, operation name, result type, and resource ID.

---

### **View Audit Logs**

To view audit logs for your Key Vault, you'll need to construct a Kusto query to filter all Key Vault audit activity.

1. **Go to the Azure Portal** and navigate to your **Log Analytics workspace**.

2. **Open the Log Analytics workspace** and create a query to filter Key Vault activities.

**Sample Kusto Query to filter Key Vault audit activity**:

```kusto
AzureDiagnostics
| where ResourceType == "VAULTS" and Category == "AuditEvent"
| project TimeGenerated, OperationName, ResultDescription, CallerIPAddress, Resource
| order by TimeGenerated desc
```

- This query filters logs for Key Vault audit events and shows the timestamp, operation name, result, caller IP address, and resource involved.

---

### **Backup and Restore Key Vault Item & View Logs**

To track Key Vault operations like **backup** and **restore**, perform these actions and rerun the query to verify new audit entries:

1. **Backup a Secret**:

```bash
az keyvault secret backup --vault-name <your-key-vault-name> --name <your-secret-name> --file <path-to-backup-file>
```

2. **Restore a Secret**:

```bash
az keyvault secret restore --vault-name <your-key-vault-name> --file <path-to-backup-file>
```

3. **Rerun the query** to see audit logs for the backup and restore operations. Use the same query, focusing on **OperationName** like `"SecretBackup"` or `"SecretRestore"`.

---

### **Enable Log Categories: Request and Errors**

You can enable additional log categories such as **Request** and **Errors** for more granular logging.

**Update the diagnostic settings to include `Request` and `Errors` log categories**:

```bash
az monitor diagnostic-settings update `
--resource "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<vault-name>" `
--name "keyvault-diagnostics" `
--logs '[{"category": "AuditEvent","enabled": true},{"category": "Request","enabled": true},{"category": "Errors","enabled": true}]' `
 --workspace "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.OperationalInsights/workspaces/myWorkspace"
```

- This updates the diagnostic settings to capture **Request** and **Errors** categories.

4. **Perform actions like creating or deleting keys** to generate new log entries.

---

### **Refine Your Query**

To focus on newly enabled log categories (`Request` and `Errors`), refine your query to include them:

**Example Query for Requests and Errors**:

```kusto
AzureDiagnostics
| where ResourceType == "VAULTS" and (Category == "AuditEvent" or Category == "Request" or Category == "Errors")
| project TimeGenerated, OperationName, ResultDescription, CallerIPAddress, Category, Resource
| order by TimeGenerated desc
```

- This query captures logs across multiple categories (`AuditEvent`, `Request`, and `Errors`), giving you insights into various types of operations.

---

### **Review and Update Diagnostic Settings**

Regularly review and update your diagnostic settings to ensure you're capturing the necessary logs for comprehensive auditing. You can always add or remove log categories using the `update` command as shown above.

### Part 6: Network Isolation

Network isolation is essential for securing your Azure Key Vault by restricting access to specific virtual networks and IP addresses. This ensures that only authorized resources can access your Key Vault.

#### Disable Access from Public Networks

##### **Disable Public Network Access**

```bash
az keyvault update --name <key-vault-name> --resource-group myResourceGroup --public-network-access Disabled
```

- This command disables public network access to the Key Vault `myKeyVault`, ensuring that only private network access is allowed.

#### Verify Access Denied in Azure Portal

##### **Attempt to Access Key Vault**

- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Key vaults" in the left-hand menu.
- Select the Key Vault.
- Attempt to access the secrets or certificates in the Key Vault.
- You should see an "Access denied" message, indicating that public network access is disabled.

![alt text](images/Part6-a.png)

#### Get User's Public IP Address

##### **Get Public IP Address**

```bash
curl https://api.ipify.org
```

- This command retrieves your public IP address. Note down the IP address returned by the command.

#### Add User's IP Address to Allowed List

##### **Enable Public Network Access With a default action of Deny**

```bash
az keyvault update \
  --resource-group myResourceGroup \
  --name <key-vault-name> \
  --public-network-access Enabled \
  --default-action Deny
```
- This command enables public network access for the Key Vault and sets the default action to `Deny`.

##### **Add IP Address Rule to Key Vault**

```bash
az keyvault network-rule add --resource-group myResourceGroup --name <key-vault-name> --ip-address <your-public-ip-address>
```
- Replace `<your-public-ip-address>` with the IP address obtained from the previous step. This command adds an IP address rule to the Key Vault, allowing access from your public IP address.

#### View Network Access in Azure Portal

##### **View Network Access Configuration**

- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Key vaults" in the left-hand menu.
- Select the Key Vault `<key-vault-name>`.
- Go to the "Networking" section under "Settings".
- Verify that your IP address is listed under the "Firewall and virtual networks" section.

![alt text](images/Part6-b.png)
#### Verify Access Granted in Azure Portal

##### **Attempt to Access Key Vault Again**

- Open the [Azure Portal](https://portal.azure.com/).
- Navigate to "Key vaults" in the left-hand menu.
- Select the Key Vault `myKeyVault`.
- Attempt to access the secrets or certificates in the Key Vault again.
- You should now have access, indicating that your IP address has been successfully added to the allowed list.

![alt text](images/Part6-c.png)

This section guides users through disabling public network access, verifying access denial, obtaining their public IP address, adding their IP address to the allowed list, and verifying access to the Azure Key Vault.xxx

### 1. **Delete the Key Vault and Troubleshooting**

When deleting a Key Vault, you may encounter issues due to features like **Soft Delete** or **Purge Protection**. Follow these steps:

#### **Attempt to Delete the Key Vault via Azure CLI**

Try deleting the Key Vault using the following command:

```bash
az keyvault delete --name <your-key-vault-name>
```

If **Soft Delete** is enabled, this command will mark the Key Vault for deletion but not remove it entirely. You may need to purge it afterward.

#### **Troubleshoot Deletion Errors**

- If you encounter errors, run the following command to check if **Soft Delete** or **Purge Protection** is enabled:

```bash
az keyvault show --name <your-key-vault-name> --query properties
```

- If **Soft Delete** is enabled, you may still see the Key Vault in a **deleted state**, but it won't be fully removed.

#### **Purge the Key Vault**

If **Soft Delete** is enabled and you want to delete the Key Vault permanently, you must purge it using this command:

```bash
az keyvault purge --name <your-key-vault-name>
```

This will completely remove the Key Vault from your subscription, bypassing any soft-delete recovery period.

---

### 2. **Terraform Configuration for Key Vault Management**

To automate Key Vault creation and management with Terraform, follow these steps:

#### **Terraform Installation**

If you haven't already installed Terraform, you can install it with **Chocolatey** (for Windows):

```bash
choco install terraform
```

Alternatively, visit [Terraform's installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli) for other platforms.

---

#### **Configure Terraform Backend (Optional: Store State in Azure Storage)**

Create an Azure Storage account for storing the Terraform state file:

```bash
az storage account create --resource-group <resource-group> --name <storage-account-name> --sku Standard_LRS --location <location>
az storage container create --name <container-name> --account-name <storage-account-name>
```

Then, configure the Terraform backend in your `main.tf` file:

```hcl
terraform {
  backend "azurerm" {
    storage_account_name = "<storage-account-name>"
    container_name       = "<container-name>"
    key                  = "terraform.tfstate"
  }
}
```

This will store the state file centrally, allowing for collaboration and consistency.

---

#### **Terraform Configuration for Azure Key Vault**

Below is a sample `main.tf` configuration for creating an Azure Key Vault, including optional purge protection, secrets, and certificates:

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "myResourceGroup"
  location = "East US"
}

resource "azurerm_key_vault" "example" {
  name                        = "myUniqueKeyVaultName"   # Ensure it's globally unique
  location                    = azurerm_resource_group.example.location
  resource_group_name          = azurerm_resource_group.example.name
  sku_name                    = "standard"
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_enabled         = true
  purge_protection_enabled    = true

  # Removing access policies since we're using RBAC instead
}

# Define role assignments for RBAC roles
resource "azurerm_role_assignment" "key_vault_admin" {
  scope                = azurerm_key_vault.example.id
  role_definition_name = "Key Vault Administrator" # Role with full access to manage Key Vault resources
  principal_id         = var.user_object_id # Assign the role to the user or service principal's object ID
}

# Optional: Create a secret in Key Vault
resource "azurerm_key_vault_secret" "example" {
  name         = "mySecret"
  value        = "sensitive-information"
  key_vault_id = azurerm_key_vault.example.id
}

# Optional: Create a certificate in Key Vault
resource "azurerm_key_vault_certificate" "example" {
  name         = "myCertificate"
  key_vault_id = azurerm_key_vault.example.id

  certificate_policy {
    issuer_parameters {
      name = "Self"
    }

    key_properties {
      exportable = true
      key_type   = "RSA"
      key_size   = 2048
      reuse_key  = true
    }

    secret_properties {
      content_type = "application/x-pem-file"
    }

    x509_certificate_properties {
      subject            = "CN=example.com"
      validity_in_months = 12
    }

    lifetime_action {
      action {
        action_type = "AutoRenew"
      }

      trigger {
        days_before_expiry = 30
      }
    }
  }
}
```

#### **Steps in the Terraform Configuration:**

1. **Provider Configuration:**
   - The `azurerm` provider is used to interact with Azure resources.
   
2. **Key Vault Creation:**
   - The `azurerm_key_vault` resource defines the creation of an Azure Key Vault. The `soft_delete_enabled` and `purge_protection_enabled` options ensure the Key Vault and its contents are recoverable even if deleted, and it can't be purged accidentally.

3. **Access Policies:**
   - The access policy grants permissions for the logged-in user or a specific service principal to manage keys, secrets, and certificates within the Key Vault.

4. **Secrets and Certificates (Optional):**
   - Optional resources for creating secrets and certificates in the Key Vault are included. 

---

### 3. **Enable Purge Protection (After Creation)**

If you need to enable **Purge Protection** after the Key Vault is created, update your `azurerm_key_vault` resource in Terraform to include:

```hcl
purge_protection_enabled = true
```

Then apply your Terraform configuration:

```bash
terraform apply
```

---

### Summary:

- **Delete the Key Vault:** Use CLI to delete and purge the Key Vault, and troubleshoot any errors by checking for soft delete or purge protection.
- **Automate Key Vault Creation with Terraform:** Define your Key Vault resource, access policies, and optional secrets or certificates.
- **Enable Purge Protection:** Ensure the Key Vault and its contents are protected from accidental or malicious deletion.