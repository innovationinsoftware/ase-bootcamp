## Session 2: Core Concepts in Single-SPA and AngularJS (45 minutes)  
   
In this session, we will dive into some core concepts necessary for building robust micro front-end applications using AngularJS and Single-SPA. These concepts include routing, state management, and form handling. Understanding and implementing these concepts will help you build scalable and maintainable micro front-end applications.  
   
### Key Concepts  
   
#### Routing  
   
Routing allows users to navigate between different views or components in an application. In a micro front-end architecture, each micro front-end can have its own routing configuration.  
   
#### State Management  
   
State management is crucial for maintaining and sharing state across different micro front-ends. It ensures that different parts of your application remain consistent and up-to-date.  
   
#### Form Handling  
   
Forms are essential for user interaction within an application. Proper form handling includes creating forms, validating inputs, and managing form submissions.  
   
### Additional Reading Resources  
   
- [Single-SPA Documentation on Routing](https://single-spa.js.org/docs/configuration)  
- [AngularJS Routing Guide](https://docs.angularjs.org/guide/routing)  
- [State Management in AngularJS](https://www.pluralsight.com/guides/front-end-javascript/using-services-angularjs-manage-state)  
- [Form Handling in AngularJS](https://docs.angularjs.org/guide/forms)  
   
### 1. Implementing Routing within Micro Front-Ends  
   
Routing allows users to navigate between different views or components in an application. In a micro front-end architecture, each micro front-end can have its own routing configuration.  
   
#### Create Routes for Different Components  
   
**a.) Update the Dashboard Micro-Frontend**  
   
- Open the `dashboard` micro front-end directory.  
- Delete the `root` component
- Rename the `about` component to `help`
- Rename the `home` component to   `dashboard` if you did not create a new dashboard component in Session 1
- Make changes to the code in the help component and explain how users can interpret the visualizations on the dashboard
- Correct the references the renamed dashboard component code
- Update `src/components/components.all.js` to import the renamed components
  ```javascript
  import "./dashboard/dashboard.component";
  import "./help/help.component";
  ```
` The purpose of this file is to import and include the components dashboard.component and help.component into the current module or application. This is typically done to ensure that these components are registered and available for use within the application. `

- Update the file named `src/app.module.js` and add the following code to enable routing in the navigation microfrontend:  
   
```javascript  
import ngRoute from "angular-route";

const appAngular = angular.module("app", ["ngRoute"]);

appAngular.config([
  "$locationProvider",
  "$routeProvider",
  function ($locationProvider, $routeProvider) {
    $routeProvider
      .when("/dashboard", {
        template: "<dashboard />",
      })
      .when("/help", {
        template: "<help />",
      })
      .otherwise({ redirectTo: "/dashboard" });
  },
]);
export default appAngular;

```  
This file creates a new AngularJS module named app and includes ngRoute as a dependency. This module will be the main module for the application. The code block configures the routes for the application using the `$routeProvider` service. The config method is used to set up the routing configuration:
- `$locationProvider`: This service is used to configure the application's URL handling.
- `$routeProvider`: This service is used to define routes and their associated templates or components.
  
The routes are defined as follows:

- `/dashboard`: When the URL is /dashboard, the <dashboard /> component is rendered.
- `/help`: When the URL is /help, the <help /> component is rendered.
- `otherwise`: If the URL does not match any of the defined routes, the application redirects to /dashboard.
   
Next update the `src/index.js` file to include the route configuration from the app module as follows:  
   
```javascript  
import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import appAngular from "./app.module";

import "./components/components.all";

const ngLifecycles = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "app",
  ngRoute: true,
  preserveGlobal: false,
  template: "",
});



export const bootstrap = ngLifecycles.bootstrap;
export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;

```  
   
**b.) Repeat Similar Steps for Other Micro Front-Ends**  
   
Follow the same steps for the `projects`, `tasks`, and `team` microfrontends, creating appropriate route configurations for the components you created in Session 1 and updating the `src/index.js` files in each microfrontend directory as you have done in step 1a above.  
   
#### Update the Root Config to Support Routing  
   
- Open the `projectmanagement/src/microfrontend-layout.html` file and add/update the routes to include the dashboard route:  
   
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
....
</main>  
```  

The `<route path="dashboard">` tag specifies that when the URL path is /dashboard, the @projectmgt/dashboard microfrontend should be loaded.

Repeat step 1b and add the routes for the remaining microfrontends similar to what you have in the dashboard microfrontend. Make sure the microfrontends are referenced correctly.
   
### 2. State Management  
   
State management is crucial for maintaining and sharing state across different micro front-ends. We will use a simple service to manage state in this example.  
   
#### Introduction to State Management Techniques  
   
While more advanced state management libraries like NgRx can be used, we will start with a simple AngularJS service.  
   
#### Create a Shared State Service  
   
**a.) Create a Shared Service in the Root Config**  
   
- Copy the angularjs sample and rename the directory to sharedstate
- Create a new directory named `src/services` in the sharedstate directory and cd into it
- Create a new file named `src/services/shared-state.service.js` and add the following code:  
   
```javascript  
import angular from 'angular';  

let projects = [
  { id: 1, name: 'Project Alpha', description: 'Description of Project Alpha', date: '2023-01-01' },
  { id: 2, name: 'Project Beta', description: 'Description of Project Beta', date: '2023-02-01' },
  { id: 3, name: 'Project Gamma', description: 'Description of Project Gamma', date: '2023-03-01' },
  { id: 4, name: 'Project Delta', description: 'Description of Project Delta', date: '2023-04-01' },
  { id: 5, name: 'Project Epsilon', description: 'Description of Project Epsilon', date: '2023-05-01' },
  { id: 6, name: 'Project Zeta', description: 'Description of Project Zeta', date: '2023-06-01' },
  { id: 7, name: 'Project Eta', description: 'Description of Project Eta', date: '2023-07-01' },
  { id: 8, name: 'Project Theta', description: 'Description of Project Theta', date: '2023-08-01' },
  { id: 9, name: 'Project Iota', description: 'Description of Project Iota', date: '2023-09-01' },
  { id: 10, name: 'Project Kappa', description: 'Description of Project Kappa', date: '2023-10-01' },
];

let tasks = [
  { id: 1, projectId: 1, name: 'Design Mockups', status: 'Completed' },
  { id: 2, projectId: 2, name: 'API Integration', status: 'In Progress' },
];

let teams = [
  { id: 1, name: 'Team Alpha', members: ['John Doe', 'Jane Smith'] },
  { id: 2, name: 'Team Beta', members: ['Alice Johnson', 'Bob Brown'] },
];

export const sharedStateResource = () => {  
  let sharedState = {
    dashboard: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalTeamMembers: teams.length,
      projects: projects,
      tasks: tasks,
      teams: teams
    }
  };  
  
  const getState = (key) => sharedState[key];  
  const setState = (key, value) => {  
    sharedState[key] = value;  
  };  
  
  return { getState, setState };  
};
```  

Feel free to modify the state and mock data to your liking.

**b.) Update the shared state index.js file**
   
Update the `src/index.js` file to include and export the shared state service with the following code:  
   
```javascript  
import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import {sharedStateResource} from "./services/shared-state.service";

const ngLifecycles = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "sharedState",
  ngRoute: true,
  preserveGlobal: false,
  template: "",
});


export const sharedStateService = sharedStateResource();
export const bootstrap = ngLifecycles.bootstrap;
export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;

```  

Install the following packages:

- webpack-config-single-spa
- webpack-merge
  
Then update `sharedstate/webpack.config.js` to use the Single-SPA defaults using the following code:

```javascript
module.exports = (webpackConfigEnv,argv) => {

  const defaultConfig = singleSpaDefaults({
    orgName: "projectmgt",
    projectName: "sharedstate",
    webpackConfigEnv,
    argv,
    externals: [/^@projectmgt\/.+/],
  });

  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return merge(defaultConfig, config);
};
```

If you get an `emit` error, delete the following plugin from the `sharedstate/webpack.config`:
```javascript
new HtmlWebpackPlugin({
      template: "index.html",
    })
```

The function calls `singleSpaDefaults`, which is a utility function provided by the single-spa framework. This function sets up default Webpack configurations for a Single SPA project. It takes an object with the following properties:

- orgName: The organization name, in this case, "projectmgt".
- projectName: The project name, in this case, "sharedstate".
- webpackConfigEnv: The environment configuration for Webpack.
- argv: The arguments passed to the Webpack CLI.
- externals: An array of regular expressions or strings that specify external dependencies. Here, it matches any module that starts with @projectmgt/.
   
**c.) Use the Shared Service in Micro Front-Ends**  
   
- In the `dashboard` micro front-end, inject the shared service and use it to manage state by updating `src\components\dashboard\dashboard.component.js` as follows:  
   
```javascript  
import dashboardTemplate from "./dashboard.component.html";
import { sharedStateService } from '@projectmgt/sharedstate';

angular.module("app").component("dashboard", {
  template: dashboardTemplate,
  controller: function() {
    this.sharedState = sharedStateService.getState("dashboard");
    this.updateSharedState = (key, value) => {
      sharedStateService.setState("dashboard", { ...this.sharedState, [key]: value });
    };
  },
  controllerAs: 'vm'
});
```

Update the `src\components\dashboard\dashboard.component.html` view accordingly and bind the data from the shared state. Below is an example code for the view that will work with the mock API above:
```html
<div class="container mt-4">  
  <div class="row">  
    <!-- Project Summary Card -->  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Project Summary</div>  
        <div class="card-body">  
          <h5 class="card-title">Total Projects</h5>  
          <p class="card-text display-4">{{ vm.sharedState.totalProjects }}</p>  
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
          <p class="card-text display-4">{{ vm.sharedState.totalTasks }}</p>  
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
          <p class="card-text display-4">{{ vm.sharedState.totalTeamMembers }}</p>  
          <a href="/team" class="btn btn-primary">View Team</a>  
        </div>  
      </div>  
    </div>  
  </div>  

  <!-- Recent Activities Table -->  
  <div class="row">  
    <div class="col-md-12">  
      <div class="card">  
        <div class="card-header d-flex justify-content-between align-items-center">
          Recent Activities
          <a href="dashboard#!/help" class="btn btn-secondary">Help</a>
        </div>  
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
              <tr ng-repeat="activity in vm.sharedState.projects">  
                <td>{{ activity.description }}</td>  
                <td>{{ activity.name }}</td>  
                <td>{{ activity.date }}</td>  
              </tr>  
            </tbody>  
          </table>  
        </div>  
      </div>  
    </div>  
  </div>  
</div>
```

(Optional) Repeat the process above for the remaining microfrontends:
- Create a Mock API and expose the data to be used in the microfrontend and update `src/services/shared-state.service.js` as you did in Step 2a above
- Follow the same process as in step 2c above and update components in your microfrontend to use the APIs in the shared state.
   
### 3. Form Handling  
   
Forms are essential for user interaction within an application. We will create a form to add new projects.  
   
#### Create and Manage Forms  
   
**a.) Create a Form Component in the Projects Micro-Frontend**  
   
- In the `projects` micro front-end, create or update the file named `src/components/projects/projects.component.html` and add the following code:  

```html
<div class="container mt-4">
  <h2>Projects</h2>
  <form name="projectForm" ng-submit="vm.addProject(projectForm)" novalidate>
    <div class="form-group">
      <label for="projectName">Project Name:</label>
      <input type="text" id="projectName" name="projectName" class="form-control" ng-model="vm.newProject.name" required />
      <div class="invalid-feedback" ng-show="projectForm.projectName.$touched && projectForm.projectName.$invalid">Project name is required.</div>
    </div>
    <div class="form-group">
      <label for="projectDescription">Project Description:</label>
      <textarea id="projectDescription" name="projectDescription" class="form-control" ng-model="vm.newProject.description" required></textarea>
      <div class="invalid-feedback" ng-show="projectForm.projectDescription.$touched && projectForm.projectDescription.$invalid">Project description is required.</div>
    </div>
    <br/>
    <button type="submit" class="btn btn-primary" ng-disabled="projectForm.$invalid">Add Project</button>
  </form>

  <h3 class="mt-4">Project List</h3>
  <ul class="list-group">
    <li class="list-group-item" ng-repeat="project in vm.projects">
      <strong>{{ project.name }}</strong>: {{ project.description }}
    </li>
  </ul>
</div>
```

Update the `src/components/projects/projects.component.js` controller file to use the shared state:
   
```javascript  
import projectsTemplate from "./projects.component.html";
import { sharedStateService } from '@projectmgt/sharedstate';

angular.module("app").component("projects", {
  template: projectsTemplate,
  controller: function() {
    this.sharedState = sharedStateService.getState("projects") || { projects: [] };
    this.projects = this.sharedState.projects;
    this.newProject = {};

    this.updateSharedState = (key, value) => {
      sharedStateService.setState("projects", { ...this.sharedState, [key]: value });
    };

    this.addProject = (form) => {
      if (form.$valid) {
        this.projects.push(this.newProject);
        this.updateSharedState('projects', this.projects);
        this.newProject = {}; // Reset form
        form.$setPristine();
        form.$setUntouched();
      } else {
        console.log("Form is invalid");
      }
    };
  },
  controllerAs: 'vm'
});
```  

Update `src/components/components.all.js` to include the projects component:

```javascript
import "./projects/projects.component";
```
   
- Update the `/src/index.js` file to include the form component:  
   
```javascript  
import singleSpaAngularJS from "single-spa-angularjs";
import angular from "angular";
import appAngular from "./app.module";
import "./components/components.all";

const ngLifecycles = singleSpaAngularJS({
  angular: angular,
  mainAngularModule: "app",
  ngRoute: true,
  preserveGlobal: false,
  template: "<projects />",
});

export const bootstrap = ngLifecycles.bootstrap;
export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;

```  

Make sure that the projects component route is configured in `src/app.module.js` as follows:

```javascript
import ngRoute from "angular-route";

const appAngular = angular.module("app", ["ngRoute"]);

appAngular.config([
  "$locationProvider",
  "$routeProvider",
  function ($locationProvider, $routeProvider) {
    $routeProvider
      .when("/projects", {
        template: "<projects />",
      })
      //.otherwise({ redirectTo: "/home" });
  },
]);
export default appAngular;

```

Update `webpack.config.js` to use the Single-SPA defaults configuration and merge it with the existing webpack config object. It should like this afterwards:

```javascript
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const { merge } = require("webpack-merge");
const path = require("path");
const singleSpaDefaults = require("webpack-config-single-spa");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    libraryTarget: "system",
  },
  devServer: {
    host: "localhost",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = (webpackConfigEnv,argv) => {

  const defaultConfig = singleSpaDefaults({
    orgName: "projectmgt",
    projectName: "projects",
    webpackConfigEnv,
    argv,
    externals: [/^@projectmgt\/.+/],
  });

  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return merge(defaultConfig, config);
};
```

- In a terminal window, navigate to the projects directory
- Run `npm run serve`
- Navigate to the url displayed in the terminal e.g. http://localhost:8080
- You should see the following message indicating that the microfrontend module is ready
  
```html
Your Microfrontend is not here
The @projectmgt/projects microfrontend is running in "integrated" mode, since standalone-single-spa-webpack-plugin is disabled. This means that it does not work as a standalone application without changing configuration.

How do I develop this microfrontend?
To develop this microfrontend, try the following steps:

Copy the following URL to your clipboard: http://localhost:8080/projectmgt-projects.js
In a new browser tab, go to the your single-spa web app. This is where your "root config" is running. You do not have to run the root config locally if it is already running on a deployed environment - go to the deployed environment directly.
In the browser console, run localStorage.setItem('devtools', true); Refresh the page.
A yellowish rectangle should appear at the bottom right of your screen. Click on it. Find the name @projectmgt/projects and click on it. If it is not present, click on Add New Module.
Paste the URL above into the input that appears. Refresh the page.
Congrats, your local code is now being used!
For further information about "integrated" mode, see the following links:

Local Development Overview
Import Map Overrides Documentation
If you prefer Standalone mode
To run this microfrontend in "standalone" mode, the standalone-single-spa-webpack-plugin must not be disabled. In some cases, this is done by running npm run start:standalone. Alternatively, you can add --env standalone to your package.json start script if you are using webpack-config-single-spa.

If neither of those work for you, see more details about enabling standalone mode at Standalone Plugin Documentation.
  ```
- End the terminal session by pressing Ctrl + C
- Add the projects microfrontend module url to the import map in the root config project `src\index.ejs` file e.g. 
  
  ```javascript
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

- Update the microfrontend layout definition file `src\microfrontend-layout.html` to include the route to the projects microfrontend. For example:
  ```html
    <single-spa-router>
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
  </main>
</single-spa-router>
  ```

### Additional Tasks

During this exercise, you created a shared state using a Javascript object. Your next challenge will be to use NgRx to simplify application state across the microfrontends. This is extra tasks outside this lab exercise.
   
### Summary  
   
In this session, we covered key concepts such as routing, state management, and form handling in micro front-end applications using AngularJS and Single-SPA. We implemented routing for different components, created a shared state service for managing state across micro front-ends, and built a form for user interaction. These concepts are essential for building scalable and maintainable micro front-end applications. Remember to explore the additional reading resources provided to deepen your understanding of these concepts.  
   
### Additional Resources  
   
- [Single-SPA Documentation on Routing](https://single-spa.js.org/docs/configuration)  
- [AngularJS Routing Guide](https://docs.angularjs.org/guide/routing)  
- [State Management in AngularJS](https://www.pluralsight.com/guides/front-end-javascript/using-services-angularjs-manage-state)  
- [Form Handling in AngularJS](https://docs.angularjs.org/guide/forms)