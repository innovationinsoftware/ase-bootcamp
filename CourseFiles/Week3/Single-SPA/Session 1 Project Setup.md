## Session 1: Single-SPA Angular JS Project Setup (60 minutes)  

### 1. Environment Setup  

#### Install Node.js and Angular CLI  
To start with, you need to have Node.js and npm installed on your machine. You can download and install Node.js from [Node.js official website](https://nodejs.org/).  

Next, install the Angular CLI globally using npm:  
```bash  
npm install -g @angular/cli  
```

#### Clone the Single-spa-angularJS Starter
Single-SPA provides a starter project to help if you want to update legacy apps that use AngularJS. This serves as a starting point that you can then build on top of using the [Recommended Setup](https://single-spa.js.org/docs/recommended-setup)
```bash  
git clone https://github.com/mbarbosasan/single-spa-angularjs-starter.git
```

 If you want to add single-spa to an existing AngularJS project, you can follow instructions on this [webpage](https://single-spa.js.org/docs/ecosystem-angularjs). However, using the starter project will save a lot of time. 

### 2. Create Base Project  

#### Initialize a New Single-SPA Root Config  
Rename the starter project directory for your project and navigate into it:  
```bash  
mv single-spa-angularjs-starter project-management-tool  
cd project-management-tool  
```
Now rename the name of the organisation used in the root-config:

- Rename `src/my-org-root-config.js` to `src/projectmgt-config.js`
- Open `webpack.config.js`
- Rename orgName from "my-org" to "projectmgt"
- Rename "@my-org/root-config" to "@projectmgt/root-config" in the `package.json` file
- Rename all instances of "my-org" to "projectmgt" in `src/index.ejs` and `src/microfrontend-layout.html`   

Install the dependencies:  
```bash  
npm install  
```


For the purpose of this exercise, we will use Bootstrap for styling. You can add the latest Bootstrap CDN reference in the head of the `src\index.ejs` file. Alternatively, you can use a different UI framework and adjust the application layout accordingly. Below is an example of using bootstrap in `src\index.ejs`:

```html
 <title>Root Config</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
```

The `root-config.js` file will register and construct the AngularJS micro front-end applications that you will define in the SystemJS import map file in the `index.ejs` file. The `microfrontend-layout.html` contains the Single-SPA layout definition for your application. You can learn more about layout definitions [here](https://single-spa.js.org/docs/layout-definition/).  

For additional reading on setting up the root config, refer to the [Single-SPA documentation](https://single-spa.js.org/docs/getting-started-overview/).

#### Create AngularJS Micro Front-Ends  
- Create copies of the `angularjs` micro-frontend folder named:

  - navbar

  - welcome

  - dashboard

  - projects

  - tasks

  - team  
- Navigate into each microfrontend directory and run ```npm install```
  

### 3. Configure Single-SPA  

#### Integrate AngularJS Applications into the Single-SPA Root Config  
Open the `projectmanagement/src/index.ejs` file and register your micro front-ends using the SystemJS import map. Each micro frontend registration references the webpack bundle located at the address where the frontend is running:  

```html  
    <% if (isLocal) { %>
  <script type="systemjs-importmap">
    {
      "imports": {
        "@projectmgt/root-config": "//localhost:9000/projectmgt-root-config.js",
        "@projectmgt/navigation": "http://localhost:8080/main.js",
        "@projectmgt/welcome": "http://localhost:8081/main.js",
        "@projectmgt/dashboard": "http://localhost:8082/projectmgt-dashboard.js",
        "@projectmgt/sharedstate": "http://localhost:8083/projectmgt-sharedstate.js",
        "@projectmgt/projects": "http://localhost:8084/projectmgt-projects.js"
      }
    }
  </script>
  <% } %>
```
For the microfrontends to load correctly, you will have to start them in the order of the ports defined in the import map.
To learn about import maps and SystemJS in Single-SPA refer to this [page](https://single-spa.js.org/docs/recommended-setup/#import-maps)   
For more information on application registration, refer to the [Single-SPA application documentation](https://single-spa.js.org/docs/api#registerapplication).  

### 4. Set Up the User Interface  

#### Install UI Framework  
Make sure you have added bootstrap or referenced the UI libraries of your choice in the `projectmanagement\src\index.ejs` file of the root project.

#### Create Navigation and Application Shell  

**a.) Update the navbar microfrontend**

In the `navbar` directory, create a new directory named `navigation` inside the `components` directory, create a new file named `navbar\src\components\navigation\navbar.component.html` and add the following code:  
```html 
<nav class="navbar navbar-expand-lg navbar-light bg-light">  
  <a class="navbar-brand" href="/">Project Management Tool</a>  
  <div class="collapse navbar-collapse">  
    <ul class="navbar-nav mr-auto">  
      <li class="nav-item">  
        <a class="nav-link" href="/dashboard">Dashboard</a>  
      </li>  
      <li class="nav-item">  
        <a class="nav-link" href="/projects">Projects</a>  
      </li>  
      <li class="nav-item">  
        <a class="nav-link" href="/task">Tasks</a>  
      </li>  
      <li class="nav-item">  
        <a class="nav-link" href="/team">Team</a>  
      </li>  
    </ul>  
  </div>  
</nav>  
```

Create a new file named `navbar/src/components/navigation/navbar.component.js` and add the following code:
```javascript
import rootTemplate from "./navbar.component.html";

const navigationComponent =  {
  template: rootTemplate,
  controller: function () {
    this.$onInit = function () {
      console.log("Navigation component initialized");
    };
  },
};

export default navigationComponent;

```

Update `navbar/src/components/components.all.js` to the following:
```javascript
import "./navigation/navbar.component";
```

Update `app.module.js` to the following:
```javascript
import ngRoute from "angular-route";
import navigationComponent from "./components/navigation/navbar.component";

const appAngular = angular.module("app", ["ngRoute"]);
appAngular.component("navigation", navigationComponent);


export default appAngular;
```

Update `navbar/src/index.js` to the following code:
```javascript
import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import appAngular from "./app.module";

import "./components/components.all";
import "../src/styles.global.css";

const ngLifecycles = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "app",
  ngRoute: true,
  preserveGlobal: false,
  template: "<navigation />",
});

export const bootstrap = ngLifecycles.bootstrap;
export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;

```

**b.) Add navigation to the projectmanagement root application**

Open the `projectmanagement/src/microfrontend-layout.html` file and update the code layout definition to the following:

```html
  <main>
    <nav>
      <application name="@projectmgt/navigation"></application>
    </nav>
    <route default>
      <application name="@projectmgt/welcome"></application>
    </route>
  </main>
```

#### Build the UI for Each Micro Front-End  
For each micro front-end, create basic components to display some sample data. **Use your imagination or ChatGPT to generate the UI for the components in the frontend**. For example, in the `dashboard` micro front-end directory, create a new component `/src/components/dashboard/dashboard.component.js`:  
```javascript  
import dashboardTemplate from "./dashboard.component.html";  
import { storeInstance, actionsInstance } from '@projectmgt/sharedstate';  
   
angular.module("app").component("dashboard", {  
  template: dashboardTemplate,  
  controller: function() {  
    this.projects = [];  
    this.tasks = [];  
    this.team = [];  
    this.unsubscribe = null;  
  
    this.$onInit = () => {  
      this.unsubscribe = storeInstance.subscribe(() => {  
        const state = storeInstance.getState();  
        this.projects = state.projects;  
        this.tasks = state.tasks;  
        this.team = state.team;  
      });  
  
      storeInstance.dispatch(actionsInstance.setProjects([{ id: 1, name: 'Project Alpha' }]));  
      storeInstance.dispatch(actionsInstance.setTasks([{ id: 1, name: 'Task 1' }]));  
      storeInstance.dispatch(actionsInstance.setTeam([{ id: 1, name: 'John Doe' }]));  
    };  
  
    this.$onDestroy = () => {  
      if (this.unsubscribe) {  
        this.unsubscribe();  
      }  
    };  
  },  
  controllerAs: 'vm'  
});  
```

Create a new view for the dashboard component `/src/components/dashboard/dashboard.component.html` and add the following code:

```html
<div class="container mt-4">  
  <div class="row">  
    <!-- Project Summary Card -->  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Project Summary</div>  
        <div class="card-body">  
          <h5 class="card-title">Total Projects</h5>  
          <p class="card-text display-4">5</p>  
          <a href="/project" class="btn btn-primary">View Projects</a>  
        </div>  
      </div>  
    </div>  
    <!-- Task Summary Card -->  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Task Summary</div>  
        <div class="card-body">  
          <h5 class="card-title">Total Tasks</h5>  
          <p class="card-text display-4">23</p>  
          <a href="/task" class="btn btn-primary">View Tasks</a>  
        </div>  
      </div>  
    </div>  
    <!-- Team Summary Card -->  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Team Summary</div>  
        <div class="card-body">  
          <h5 class="card-title">Total Team Members</h5>  
          <p class="card-text display-4">8</p>  
          <a href="/team" class="btn btn-primary">View Team</a>  
        </div>  
      </div>  
    </div>  
  </div>  

  <!-- Recent Activities Table -->  
  <div class="row">  
    <div class="col-md-12">  
      <div class="card">  
        <div class="card-header">Recent Activities</div>  
        <div class="card-body">  
          <table class="table table-hover">  
            <thead>  
              <tr>  
                <th scope="col">Activity</th>  
                <th scope="col">Project</th>  
                <th scope="col">Date</th>  
              </tr>  
            </thead>  
            <tbody>  
              <tr>  
                <td>Task "Design Mockups" completed by John Doe</td>  
                <td>Project Alpha</td>  
                <td>2023-09-20</td>  
              </tr>  
              <tr>  
                <td>New task "API Integration" assigned to Jane Smith</td>  
                <td>Project Beta</td>  
                <td>2023-09-19</td>  
              </tr>  
              <tr>  
                <td>Team meeting scheduled</td>  
                <td>All Projects</td>  
                <td>2023-09-18</td>  
              </tr>  
            </tbody>  
          </table>  
        </div>  
      </div>  
    </div>  
  </div>  
</div> 
```

Next update the dashboard component in `src/components/components.all.js` by adding the following import statement:

```javascript
import "./dashboard/dashboard.component";
```

**NOTE: The components that you import in `src/components/components.all.js` must exist in the `src/components` directory**

Repeat similar steps for the `project`, `task`, and `team` micro front-ends and create the components and their views. Use your imagination in creating these components.

### 5. Serve and Run the Application  

#### Serve Micro Front-Ends  
Navigate to each micro front-end directory and build the application:  
```bash  
cd navigation  
npm run serve  
cd ../welcome  
npm run serve  
cd ../dashboard  
npm run serve  
cd ../projects
npm run build
cd ../tasks
npm run build
cd ../team  
npm run build  
cd ..  
```

#### Run the Root Config  
Navigate to the root config directory and start the development server:  
```bash  
npm start  
```

Open your browser and navigate to `http://localhost:9000`. You should see the root application loading the registered micro front-ends based on the routes. If clicking the navbar links does not open the microfrontends, don't worry, you will learn about routing in the next session:

```html
  <main>
    <nav>
      <application name="@projectmgt/navigation"></application>
    </nav>
    <route default>
      <application name="@projectmgt/welcome"></application>
    </route>
    <route path="dashboard">
      <application name="@projectmgt/dashboard"></application>
    </route>
        <route path="projects">
      <application name="@projectmgt/projects"></application>
    </route>
    ....
  </main>
```

  and update the `routeProvider` in each micro-frontend accordingly.

### Key Concepts  

#### Single-SPA Root Config  
The root config is the entry point of your Single-SPA application. It orchestrates the loading, mounting, and unmounting of different micro front-ends based on the current route. For more details, refer to the [Single-SPA root config documentation](https://single-spa.js.org/docs/configuration).  

#### Micro Front-Ends  
Micro front-ends are individual applications that are integrated into the Single-SPA root config. Each micro front-end can be developed, tested, and deployed independently. For more information on creating micro front-ends, refer to the [Single-SPA micro front-end documentation](https://single-spa.js.org/docs/getting-started-overview/#applications).  

#### Shared Dependencies  
Shared dependencies are libraries or resources that are used by multiple micro front-ends. Loading these dependencies once and sharing them across the application reduces redundancy and improves performance. In this lab, we use Bootstrap for consistent styling and a mock API module to simulate backend API calls.  

### Summary  
In this session, you set up the development environment, created the base project with Single-SPA root config, and configured AngularJS micro front-ends. Additionally, you set up shared dependencies such as Bootstrap for consistent styling, a mock API module to simulate backend API calls, and built a basic UI for each micro front-end. Finally, you built and ran the application. You are now ready to proceed to the next session where you will implement core concepts such as routing, state management, and form handling.  
