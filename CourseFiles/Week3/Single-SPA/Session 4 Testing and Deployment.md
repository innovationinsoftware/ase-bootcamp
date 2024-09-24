## Session 4: Testing and Deployment of Micro Front-Ends (60 minutes)  
   
In this session, we will focus on the essential aspects of testing and deploying micro front-end applications. Proper testing ensures the reliability and stability of your application, while efficient deployment strategies allow you to seamlessly deliver your application to end-users. We will focus on a simplified deployment scenario using Azure Static Web Apps, which provides an efficient and scalable solution for hosting micro front-ends.

   
### Key Concepts  
   
#### Testing  
Testing is crucial for ensuring that your application works as expected and is free of bugs. We will use Jasmine and Karma for unit testing Angular components.  
   
#### Deployment
Deployment involves making your application available to users. In this session, we will focus on deploying micro front-ends to **Azure Static Web Apps**, a streamlined solution for hosting modern web applications, including micro front-end architectures.

   
### Additional Reading Resources  
- [Angular Testing Guide](https://angular.dev/guide/testing)  
- [Jasmine Documentation](https://jasmine.github.io/)  
- [Karma Documentation](https://karma-runner.github.io/latest/index.html)  
- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)  
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)  
   
### 1. Testing Micro Front-Ends  

#### Testing

Testing is a crucial part of the development process. We will use **Jasmine** and **Karma** to write and run tests for our **Angular** micro front-end applications.  
   
#### Set Up Testing Environment  
   
**a.) Install Jasmine and Karma**  

By default, **Angular** includes necessary testing packages such as **Jasmine** and **Karma**, so no additional installation is required. However, if for any reason these packages are missing, you can install them with the following command:

```bash  
npm install --save-dev jasmine-core karma karma-jasmine karma-chrome-launcher  
```  
   
**b.) Mocking Shared State Service**

Because of the isolated nature of micro front-ends and the use of a separate sharedstate micro front-end, importing from `@projectmgt/sharedstate` directly may cause issues. Therefore, we will mock sharedstate for testing purposes.

- Create a Mock for the SharedState
  - In the `dashboard` micro front-end, create a `mocks` folder at the root.
  - Inside the `mocks` folder, create a file named `sharedstate.mock.ts` with the following code:
  ```ts
  export const apiServiceInstance = {
    getProjects: () => Promise.resolve([{ id: 1, name: 'Mock Project' }]),
    getTasks: () => Promise.resolve([{ id: 1, name: 'Mock Task' }]),
    getTeam: () => Promise.resolve([{ id: 1, name: 'Mock Team Member' }]),
  };
  ```
- Configure the Mock in `tsconfig.spec.json`
  - Add the mock configuration to your `tsconfig.spec.json` file:
  ```ts
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/spec",
      "types": [
        "jasmine"
      ],
      "paths": {
        "@projectmgt/sharedstate": ["./mocks/sharedstate.mock.ts"]
      }
    },
    "include": [
      "src/**/*.spec.ts",
      "src/**/*.d.ts"
    ]
  }
  ```

This configuration ensures that the `sharedstate` is mocked during tests, preventing issues related to the isolation of micro front-ends.
   
**c.) Write Unit Tests**  
Now, write unit tests in the `dashboard` micro front-end. In the dashboard micro front-end, create a file named `dashboard.component.spec.ts` and add the following tests:
```ts  
import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize projects array', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    expect(app.projects).toEqual([]);
  });

  it('should load projects', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    await fixture.whenStable();

    expect(app.projects.length).toBeGreaterThan(0);
  });
});
```  
   
**d.) Run Tests**  
To run the tests, use the following command from `dashboard` micro front-end directory:  
```bash  
npm run test
```  
This will execute your tests using Jasmine and Karma, ensuring that your micro front-end behaves as expected.

Repeat the process for the remaining microfrontends and write suitable unit tests.
   
### 2. Deploying Micro Front-Ends

Efficient deployment of your micro front-end applications is essential for providing a seamless user experience. In this section, we will walk through deploying your `dashboard` micro front-end to **Azure Static Web Apps** using the `@azure/static-web-apps-cli`.

#### Scenario: Deploying the `dashboard` Micro Front-End to Azure Static Web Apps

**a.) Install Azure Static Web Apps CLI**  

First, install the Azure Static Web Apps CLI globally if it is not already installed:

```bash
npm install -g @azure/static-web-apps-cli
  ```

**b.) Log in to Azure**  

Log in to your Azure account:  
```bash
az login
```

**c.) Configure Static Web Apps**  

Create a `staticwebapp.config.json` file in the public folder. This configuration file will handle global headers, CORS, and other settings:
```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*"
  }
}
```

**d.) Build the Micro Front-Ends**  

Build the dashboard micro front-end as a production build:

```bash
npm run build:single-spa:dashboard
```

**e.) Deploy to Azure Static Web Apps**  

Deploy the content of the `.\dist\dashboard\` folder to Azure Static Web Apps using the following command:  

```bash
swa deploy .\dist\dashboard\ --env production
```

**f.) Update Single-SPA Root Config**  

After deployment, update the `import-map` in the Single-SPA root config (`src/index.ejs`) to reference the deployed URLs of your micro front-ends:

```html
<script type="systemjs-importmap">
  {
    "imports": {
      ...
      "@projectmgt/dashboard": "https://<your-static-web-app-url>.azurestaticapps.net/main.js"
    }
  }
</script>
```

**g.) Repeat Deployment for All Micro Front-Ends and Root Config**

After successfully deploying the `dashboard` micro front-end, follow the same steps for each of your other micro front-ends (e.g., `projects`, `tasks`, `team`).

Finally, repeat the same steps for the root-config.

### Summary  
   
In this session, we focused on testing and deploying micro front-end applications. We set up a testing environment using **Jasmine** and **Karma**, wrote unit tests for Angular components, and used the **Azure Static Web Apps CLI** to deploy the micro front-ends. We also explored configuring the deployment with a staticwebapp.config.json file to handle global settings like CORS. Proper testing and efficient deployment strategies are crucial for delivering a reliable and scalable application to end-users.
   
### Additional Resources  
- [Angular Testing Guide](https://angular.dev/guide/testing)  
- [Jasmine Documentation](https://jasmine.github.io/)  
- [Karma Documentation](https://karma-runner.github.io/latest/index.html)  
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)  
- [Azure Static Web Apps CLI Documentation](https://github.com/Azure/static-web-apps-cli)  