## Session 4: Testing and Deployment of Micro Front-Ends (60 minutes)  
   
In this session, we will focus on the essential aspects of testing and deploying micro front-end applications. Proper testing ensures the reliability and stability of your application, while efficient deployment strategies allow you to seamlessly deliver your application to end-users. We will cover various deployment scenarios, including deploying the micro front-ends to web apps on Azure, hosting them as webpack bundles in Azure Blob Storage, and deploying as Docker containers in Azure.  
   
### Key Concepts  
   
#### Testing  
Testing is crucial for ensuring that your application works as expected and is free of bugs. We will use Jasmine and Karma for unit testing AngularJS components.  
   
#### Deployment  
Deployment involves making your application available to users. We will explore three deployment scenarios:  
1. Deploying micro front-ends to web apps on Azure.  
2. Hosting micro front-ends as webpack bundles in Azure Blob Storage.  
3. Deploying micro front-ends as Docker containers in Azure.  
   
### Additional Reading Resources  
- [Jasmine Documentation](https://jasmine.github.io/)  
- [Karma Documentation](https://karma-runner.github.io/latest/index.html)  
- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)  
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)  
- [Azure Container Instances Documentation](https://docs.microsoft.com/en-us/azure/container-instances/)  
   
### 1. Testing Micro Front-Ends  
   
Testing is a crucial part of the development process. We will use Jasmine and Karma to write and run tests for our AngularJS micro front-end applications.  
   
#### Set Up Testing Environment  
   
**a.) Install Jasmine and Karma**  
First, install Jasmine and Karma along with their dependencies in each micro front-end project:  
```bash  
npm install --save-dev jasmine-core karma karma-jasmine karma-chrome-launcher  
```  
   
**b.) Configure Karma**  
Create a `karma.conf.js` file in each micro front-end project and add the following configuration:  
```javascript  
module.exports = function(config) {  
  config.set({  
    basePath: '',  
    frameworks: ['jasmine'],  
    files: [  
      'src/**/*.spec.js'  
    ],  
    preprocessors: {  
      'src/**/*.spec.js': ['webpack']  
    },  
    webpack: {  
      // webpack configuration  
    },  
    browsers: ['Chrome'],  
    singleRun: true,  
    reporters: ['progress'],  
    plugins: [  
      'karma-jasmine',  
      'karma-chrome-launcher',  
      'karma-webpack'  
    ]  
  });  
};  
```  
   
**c.) Write Unit Tests**  
Create a directory named `tests` in each micro front-end project and add unit tests. For example, in the `dashboard` micro front-end, create a file named `src/components/dashboard/dashboard.component.spec.js`:  
```javascript  
describe('Dashboard Component', function() {  
  let $componentController;  
  
  beforeEach(angular.mock.module('app'));  
  
  beforeEach(inject(function(_$componentController_) {  
    $componentController = _$componentController_;  
  }));  
  
  it('should initialize projects', function() {  
    let ctrl = $componentController('dashboard', null, {});  
    expect(ctrl.projects).toEqual([]);  
  });  
});  
```  
   
**d.) Run Tests**  
Run the tests using the following command:  
```bash  
npx karma start karma.conf.js  
```  
Repeat the process for the remaining microfrontends and write suitable unit tests.
   
### 2. Deployment Scenarios  
   
Deploying your micro front-end applications efficiently is crucial for ensuring a smooth user experience. We will explore three deployment scenarios in this section.  
   
#### Scenario 1: Deploying Micro Front-Ends to Web Apps on Azure  
   
**a.) Set Up Azure Web App**  
1. If you have an active Azure Subscription, Create a new Azure Web App for each micro front-end using the Azure Portal or Azure CLI:  
```bash  
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebAppName  
```  

**b.) Configure Deployment**  
2. Configure deployment from a Git repository or local folder. For Git deployment, set up Continuous Deployment (CD) using Azure DevOps or GitHub Actions.  
   
**c.) Build and Deploy**  
3. Build the micro front-end applications:  
```bash  
npm run build  
```  
4. Deploy the build output to the Azure Web App using the Azure CLI or an automated CI/CD pipeline.  
   
**d.) Update Single-SPA Root Config**  
5. Update the `import-map` in the root config `projectmanagement/src/index.ejs` file to point to the deployed URLs of the micro front-ends:  
```html  
<script type="systemjs-importmap">  
  {  
    "imports": {  
      "@projectmgt/root-config": "https://myWebAppName.azurewebsites.net/main.js",  
      ...  
    }  
  }  
</script>  
```  
   
#### Scenario 2: Hosting Micro Front-Ends as Webpack Bundles in Azure Blob Storage  
   
**a.) Build Webpack Bundles**  
1. Build the micro front-end applications as webpack bundles:  
```bash  
npm run build  
```  
   
**b.) Upload to Azure Blob Storage**  
2. Upload the build output to an Azure Blob Storage container. You can use the Azure Portal, Azure CLI, or Azure Storage Explorer:  
```bash  
az storage blob upload-batch -d mycontainer --account-name myaccountname -s ./dist  
```  
   
**c.) Configure Azure CDN**  
3. Configure Azure CDN to deliver the content from the Blob Storage. Create a new CDN endpoint and link it to the Blob Storage container.  
   
**d.) Update Single-SPA Root Config**  
4. Update the `import-map` in the root config to point to the CDN URLs of the micro front-ends:  
```html  
<script type="systemjs-importmap">  
  {  
    "imports": {  
      "@projectmgt/root-config": "https://mycdn.azureedge.net/main.js",  
      ...  
    }  
  }  
</script>  
```  
   
   
### Summary  
   
In this session, we focused on testing and deploying micro front-end applications. We set up a testing environment using Jasmine and Karma, wrote unit tests for AngularJS components, and explored three different deployment scenarios: deploying micro front-ends to web apps on Azure, hosting micro front-ends as webpack bundles in Azure Blob Storage, and deploying micro front-ends as Docker containers in Azure. Proper testing and efficient deployment strategies are crucial for delivering a reliable and scalable application to end-users.  
   
### Additional Resources  
- [Jasmine Documentation](https://jasmine.github.io/)  
- [Karma Documentation](https://karma-runner.github.io/latest/index.html)  
- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)  
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)  
- [Azure Container Instances Documentation](https://docs.microsoft.com/en-us/azure/container-instances/)