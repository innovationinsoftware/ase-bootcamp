## Session 3: Advanced Features in Single-SPA and AngularJS (75 minutes)  
   
In this session, we will delve into advanced features necessary for building robust and efficient micro front-end applications using AngularJS and Single-SPA. These features include implementing API calls, inter-application communication, error handling, and using NgRx for state management. Mastering these features will help you create more dynamic and resilient applications.  
   
### Key Concepts  
   
#### API Calls  
   
API calls allow your application to communicate with external services to fetch or send data. Handling API calls properly is crucial for the application's performance and user experience.  
   
#### Inter-Application Communication  
   
Inter-application communication is essential for sharing data and events between different micro front-ends. This ensures a cohesive user experience.  
   
#### Error Handling  
   
Error handling is critical for providing a robust application. It involves catching errors gracefully and providing meaningful feedback to users.  
   
#### NgRx State Management  
   
NgRx is a state management library for Angular applications. It provides a way to manage and share state across different micro front-ends in a predictable and consistent manner.  
   
### Additional Reading Resources  
   
- [Single-SPA Documentation on API Calls](https://single-spa.js.org/docs/api)  
- [AngularJS HTTP Service Guide](https://docs.angularjs.org/api/ng/service/$http)  
- [Custom Events in JavaScript](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)  
- [Error Handling in AngularJS](https://docs.angularjs.org/guide/errorhandling)  
- [NgRx Documentation](https://ngrx.io/docs)  
   
### 1. Implementing API Calls  
   
API calls enable communication between your application and external services. In this section, we will implement API calls to fetch data and display it in the application.  
   
#### Create a Service for API Calls  
   
**a.) Create an API Service in the Shared State Micro-Frontend**  
   
- In the `sharedstate` micro front-end, create a new directory named `src/services` if it doesn't exist.  
- Create a new file named `src/services/api.service.js` and add the following code for a mock API:  
   
```javascript  
import angular from 'angular';

export const apiService = () => {
  const getProjects = () => {
    return Promise.resolve([
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
    ]);
  };

  const getTasks = () => {
    return Promise.resolve([
        { id: 1, projectId: 1, name: 'Design Mockups', status: 'Completed' },
        { id: 2, projectId: 2, name: 'API Integration', status: 'In Progress' },
    ]);
  };

  const getTeam = () => {
    return Promise.resolve([
        { id: 1, name: 'John Doe', role: 'Developer' },
        { id: 2, name: 'Jane Smith', role: 'Designer' },
        { id: 3, name: 'Alice Johnson', role: 'Project Manager' },
        { id: 4, name: 'Bob Brown', role: 'Tester' },
    ]);
  };

  return { getProjects, getTasks, getTeam };
};
```  
   
- Update the `src/index.js` file to include and export the API service:  
   
```javascript  
import singleSpaAngularJS from "single-spa-angularjs";  
import angular from "angular";  
import { sharedStateResource } from "./services/shared-state.service";  
import { apiService } from "./services/api.service";  
   
const ngLifecycles = singleSpaAngularJS({  
  angular: angular,  
  mainAngularModule: "sharedState",  
  ngRoute: true,  
  preserveGlobal: false,  
  template: "",  
});  
   
export const sharedStateService = sharedStateResource();  
export const apiServiceInstance = apiService();  
export const bootstrap = ngLifecycles.bootstrap;  
export const mount = ngLifecycles.mount;  
export const unmount = ngLifecycles.unmount;  
```  
   
**b.) Use the API Service in Micro Front-Ends**  
   
- In the `dashboard` micro front-end, inject the API service and use it to fetch data, by updating `src/components/dashboard/dashboard.component.js` with the following:  
   
```javascript  
import dashboardTemplate from "./dashboard.component.html";  
import { apiServiceInstance } from '@projectmgt/sharedstate';  
   
angular.module("app").component("dashboard", {  
  template: dashboardTemplate,  
  controller: function() {  
    this.projects = [];  
    this.tasks = [];  
    this.team = [];  
  
    this.$onInit = () => {  
      apiServiceInstance.getProjects().then(data => {  
        this.projects = data;  
      });  
      apiServiceInstance.getTasks().then(data => {  
        this.tasks = data;  
      });  
      apiServiceInstance.getTeam().then(data => {  
        this.team = data;  
      });  
    };  
  },  
  controllerAs: 'vm'  
});  
```  
   
- Update the `src/components/dashboard/dashboard.component.html` view to display the fetched data:  
   
```html  
<div class="container mt-4">  
  <h2>Dashboard</h2>  
  <div class="row">  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Projects</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="project in vm.projects">  
              {{ project.name }} - {{ project.description }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Tasks</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="task in vm.tasks">  
              {{ task.name }} - {{ task.status }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Team</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="member in vm.team">  
              {{ member.name }} - {{ member.role }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
  </div>  
</div>  
```  
   
OPTIONAL: Repeat similar steps for the `projects`, `tasks`, and `team` micro front-ends to fetch and display data using the API service. Use your imagination to create the API and update the UI components accordingly.
   
### 2. Inter-Application Communication  
   
Inter-application communication is essential for sharing data and events between different micro front-ends.  
   
#### Techniques for Communication  
   
**a.) Using Custom Events**  
   
Custom events can be used to communicate between micro front-ends.  
   
- Create a new file named `src/services/event-bus.js` in the `sharedstate` micro front-end and add the following code:  
   
```javascript  
export const eventBus = new EventTarget();  
   
export const emitEvent = (eventName, detail) => {  
  const event = new CustomEvent(eventName, { detail });  
  eventBus.dispatchEvent(event);  
};  
   
export const onEvent = (eventName, callback) => {  
  eventBus.addEventListener(eventName, callback);  
};  
   
export const removeEvent = (eventName, callback) => {  
  eventBus.removeEventListener(eventName, callback);  
};  
```  
   
- Update the `src/index.js` file in the `sharedstate` directory to include and export the event bus:  
   
```javascript  
import singleSpaAngularJS from "single-spa-angularjs";  
import angular from "angular";  
import { sharedStateResource } from "./services/shared-state.service";  
import { apiService } from "./services/api.service";  
import { eventBus, emitEvent, onEvent, removeEvent } from "./services/event-bus";  
   
const ngLifecycles = singleSpaAngularJS({  
  angular: angular,  
  mainAngularModule: "sharedState",  
  ngRoute: true,  
  preserveGlobal: false,  
  template: "",  
});  
   
export const sharedStateService = sharedStateResource();  
export const apiServiceInstance = apiService();  
export const eventBusInstance = eventBus;  
export const emitEventInstance = emitEvent;  
export const onEventInstance = onEvent;  
export const removeEventInstance = removeEvent;  
export const bootstrap = ngLifecycles.bootstrap;  
export const mount = ngLifecycles.mount;  
export const unmount = ngLifecycles.unmount;  
```  
   
**b.) Using the Event Bus in Micro Front-Ends**  
   
- In the `dashboard` micro front-end, listen for custom events by updating the `src\components\dashboard\dashboard.component` with the following code:  
   
```javascript  
import dashboardTemplate from "./dashboard.component.html";  
import { eventBusInstance, onEventInstance, emitEventInstance } from '@projectmgt/sharedstate';  
   
angular.module("app").component("dashboard", {  
  template: dashboardTemplate,  
  controller: function() {  
    this.projects = [];  
    this.tasks = [];  
    this.team = [];  
  
    this.$onInit = () => {  
      onEventInstance('updateData', (event) => {  
        console.log('Data updated', event.detail);  
        this.projects = event.detail.projects;  
        this.tasks = event.detail.tasks;  
        this.team = event.detail.team;  
      });  
    };  
  
    this.updateData = () => {  
      const data = {  
        projects: this.projects,  
        tasks: this.tasks,  
        team: this.team  
      };  
      emitEventInstance('updateData', data);  
    };  
  },  
  controllerAs: 'vm'  
});  
```  
   
- Trigger events from other micro front-ends as needed:  

From the projects directory, update the `src/components/projects/projects.component.js` component with the following code:
   
```javascript  
import projectsTemplate from "./projects.component.html";  
import { sharedStateService, emitEventInstance } from '@projectmgt/sharedstate';  
   
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
  
        // Emit event to update data  
        emitEventInstance('updateData', { projects: this.projects });  
      } else {  
        console.log("Form is invalid");  
      }  
    };  
  },  
  controllerAs: 'vm'  
});  
```  
   
### 3. Error Handling  
   
Error handling is critical for providing a robust application. It involves catching errors gracefully and providing meaningful feedback to users.  
   
#### Best Practices for Error Handling  
   
**a.) Implement Error Handling in API Calls**  
   
- Update the `src/services/api.service.js` file in the `sharedstate` to include error handling :  
   
```javascript  
export const apiService = () => {  
  const handleError = (error) => {  
    console.error('API Call Error:', error);  
    alert('An error occurred while fetching data from the server.');  
  };  
  
  const getProjects = () => {  
    return fetch('/projects')  
      .then(response => response.json())  
      .catch(handleError);  
  };  
  
  const getTasks = () => {  
    return fetch('/tasks')  
      .then(response => response.json())  
      .catch(handleError);  
  };  
  
  const getTeam = () => {  
    return fetch('/team')  
      .then(response => response.json())  
      .catch(handleError);  
  };  
  
  return { getProjects, getTasks, getTeam };  
};  
```  
   
**b.) Implement Error Handling in Micro Front-Ends**  
   
- Update the `dashboard` micro front-end to handle errors gracefully by modifying the `src/components/dashboard/dashboard.component.js` code as follows:  
   
```javascript  
import dashboardTemplate from "./dashboard.component.html";  
import { apiServiceInstance } from '@projectmgt/sharedstate';  
   
angular.module("app").component("dashboard", {  
  template: dashboardTemplate,  
  controller: function() {  
    this.projects = [];  
    this.tasks = [];  
    this.team = [];  
    this.error = null;  
  
    this.$onInit = () => {  
      apiServiceInstance.getProjects().then(data => {  
        this.projects = data;  
      }).catch(error => {  
        this.error = 'Failed to load projects.';  
      });  
  
      apiServiceInstance.getTasks().then(data => {  
        this.tasks = data;  
      }).catch(error => {  
        this.error = 'Failed to load tasks.';  
      });  
  
      apiServiceInstance.getTeam().then(data => {  
        this.team = data;  
      }).catch(error => {  
        this.error = 'Failed to load team.';  
      });  
    };  
  },  
  controllerAs: 'vm'  
});  
```  
   
- Update the `src/components/dashboard/dashboard.component.html` to display error messages:  
   
```html  
<div class="container mt-4">  
  <h2>Dashboard</h2>  
  <div class="alert alert-danger" ng-if="vm.error">  
    {{ vm.error }}  
  </div>  
  <div class="row" ng-if="!vm.error">  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Projects</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="project in vm.projects">  
              {{ project.name }} - {{ project.description }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Tasks</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="task in vm.tasks">  
              {{ task.name }} - {{ task.status }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
    <div class="col-md-4">  
      <div class="card mb-4">  
        <div class="card-header">Team</div>  
        <div class="card-body">  
          <ul>  
            <li ng-repeat="member in vm.team">  
              {{ member.name }} - {{ member.role }}  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
  </div>  
</div>  
```  
   

### Summary  
   
In this session, we covered advanced features such as implementing API calls, inter-application communication, error handling, and using NgRx for state management in micro front-end applications using AngularJS and Single-SPA. We created an API service to fetch data, implemented custom events for inter-application communication, added error handling to provide a robust user experience, and used NgRx to manage and share state across different micro front-ends. These advanced features are essential for building dynamic and resilient micro front-end applications.  
   
### Additional Resources  
   
- [Single-SPA Documentation on API Calls](https://single-spa.js.org/docs/api)  
- [AngularJS HTTP Service Guide](https://docs.angularjs.org/api/ng/service/$http)  
- [Custom Events in JavaScript](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)  
- [Error Handling in AngularJS](https://docs.angularjs.org/guide/errorhandling)  
- [NgRx Documentation](https://ngrx.io/docs)