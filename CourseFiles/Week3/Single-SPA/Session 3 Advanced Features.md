## Session 3: Advanced Features in Single-SPA and AngularJS (75 minutes)  
   
In this session, we will delve into advanced features necessary for building robust and efficient micro front-end applications using Angular and Single-SPA. These features include implementing API calls, inter-application communication, error handling, and using NgRx for state management. Mastering these features will help you create more dynamic and resilient applications.  
   
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
- [Angular HTTP Client Guide](https://angular.dev/guide/http)  
- [Custom Events in JavaScript](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)  
- [Handling request failure in Angular](https://angular.dev/guide/http/making-requests#handling-request-failure)  
- [NgRx Documentation](https://ngrx.io/docs)  
   
### 1. Implementing API Calls  
   
API calls enable communication between your application and external services. In this section, we will implement API calls to fetch data and display it in the application.  
   
#### Create a Service for API Calls  
   
**a.) Create an API Service in the Shared State Micro-Frontend**  
   
- In the `sharedstate` micro front-end, create a new directory named `src/services` if it doesn't exist.  
- Create a new file named `src/services/api.service.ts` and add the following code for a mock API:  
   
```ts  
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
   
- Update the `src/main.single-spa.ts` file to include and export the API service:  
   
```ts  
import { NgZone } from '@angular/core';
import { Router, NavigationStart, provideRouter } from '@angular/router';
import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
  enableProdMode,
} from 'single-spa-angular';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { APP_BASE_HREF } from '@angular/common';
import { EmptyRouteComponent } from './app/empty-route/empty-route.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { sharedStateResource } from './services/shared-state.service';
import { apiService } from './services/api.service';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    const options = {
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        getSingleSpaExtraProviders(),
        provideRouter([{ path: '**', component: EmptyRouteComponent }]),
      ],
    };

    return bootstrapApplication(AppComponent, options);
  },
  template: '<app-sharedstate />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

export const sharedStateService = sharedStateResource();
export const apiServiceInstance = apiService();
```  
   
**b.) Use the API Service in Micro Front-Ends**  
   
- In the `dashboard` micro front-end, inject the API service and use it to fetch data, by updating `src/app/dashboard/dashboard.component.ts` with the following:  
   
```ts  
import { Component, OnInit } from '@angular/core';
import { apiServiceInstance } from '@projectmgt/sharedstate';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  tasks: any[] = [];
  team: any[] = [];

  constructor() {}

  ngOnInit() {
    apiServiceInstance.getProjects().then((data: any) => {
      this.projects = data;
    });
    apiServiceInstance.getTasks().then((data: any) => {
      this.tasks = data;
    });
    apiServiceInstance.getTeam().then((data: any) => {
      this.team = data;
    });
  }
}

```  
   
- Update the `src/app/dashboard/dashboard.component.html` view to display the fetched data:  
   
```html  
<div class="container mt-4">
  <h2>Dashboard</h2>
  <div class="row">
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">Projects</div>
        <div class="card-body">
          <ul>
            <li *ngFor="let project of projects">
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
            <li *ngFor="let task of tasks">
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
            <li *ngFor="let member of team">
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
   
- Create a new file named `src/services/event-bus.ts` in the `sharedstate` micro front-end and add the following code:  
   
```ts  
export const eventBus = new EventTarget();

export const emitEvent = (eventName: string, detail: any) => {
  const event = new CustomEvent(eventName, { detail });
  eventBus.dispatchEvent(event);
};

export const onEvent = (eventName: string, callback: any) => {
  eventBus.addEventListener(eventName, callback);
};

export const removeEvent = (eventName: string, callback: any) => {
  eventBus.removeEventListener(eventName, callback);
};
```  
   
- Update the `src/main.single-spa.ts` file in the `sharedstate` directory to include and export the event bus:  
   
```ts  
import { NgZone } from '@angular/core';
import { Router, NavigationStart, provideRouter } from '@angular/router';
import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
  enableProdMode,
} from 'single-spa-angular';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { APP_BASE_HREF } from '@angular/common';
import { EmptyRouteComponent } from './app/empty-route/empty-route.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { sharedStateResource } from './services/shared-state.service';
import { apiService } from './services/api.service';
import { eventBus, emitEvent, onEvent, removeEvent } from "./services/event-bus";

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    const options = {
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        getSingleSpaExtraProviders(),
        provideRouter([{ path: '**', component: EmptyRouteComponent }]),
      ],
    };

    return bootstrapApplication(AppComponent, options);
  },
  template: '<app-sharedstate />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

export const sharedStateService = sharedStateResource();
export const apiServiceInstance = apiService();

export const eventBusInstance = eventBus;
export const emitEventInstance = emitEvent;
export const onEventInstance = onEvent;
export const removeEventInstance = removeEvent;

```  
   
**b.) Using the Event Bus in Micro Front-Ends**  
   
- In the `dashboard` micro front-end, listen for custom events by updating the `src\app\dashboard\dashboard.component` with the following code:  
   
```ts  
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { apiServiceInstance } from '@projectmgt/sharedstate';
import { onEventInstance, emitEventInstance } from '@projectmgt/sharedstate';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  tasks: any[] = [];
  team: any[] = [];

  constructor() { }

  ngOnInit() {
    onEventInstance('updateData', (event: any) => {
      console.log('Data updated', event.detail);
      this.projects = event.detail.projects;
      this.tasks = event.detail.tasks;
      this.team = event.detail.team;
    });

    apiServiceInstance.getProjects().then((data: any) => {
      this.projects = data;
    });
    apiServiceInstance.getTasks().then((data: any) => {
      this.tasks = data;
    });
    apiServiceInstance.getTeam().then((data: any) => {
      this.team = data;
    });
  }

  updateData = () => {
    const data = {
      projects: this.projects,
      tasks: this.tasks,
      team: this.team
    };
    emitEventInstance('updateData', data);
  };
}
```  
   
- Trigger events from other micro front-ends as needed:  

From the projects directory, update the `src/app/app.component.ts` component with the following code:
   
```ts  
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { sharedStateService, emitEventInstance } from '@projectmgt/sharedstate';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import necessary modules here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  projects: any[] = [];
  newProject: any = {};
  sharedState: any;

  constructor() {}

  ngOnInit() {
    this.sharedState = sharedStateService.getState("projects") || { projects: [] };
    this.projects = this.sharedState.projects;
    this.newProject = {};
  }

  addProject() {
    if (this.newProject.name && this.newProject.description) {
      this.projects.push(this.newProject);
      this.updateSharedState('projects', this.projects);
      this.newProject = {}; // Reset form

      // Emit event to update data
      emitEventInstance('updateData', { projects: this.projects });
    } else {
      console.log('Form is invalid');
    }
  }

  updateSharedState = (key: string, value: any) => {
    sharedStateService.setState("projects", { ...this.sharedState, [key]: value });
  };
}

```  
   
### 3. Error Handling  
   
Error handling is critical for providing a robust application. It involves catching errors gracefully and providing meaningful feedback to users.  
   
#### Best Practices for Error Handling  
   
**a.) Implement Error Handling in API Calls**  
   
- Update the `src/services/api.service.ts` file in the `sharedstate` to include error handling :  
   
```ts  
export const apiService = () => {
  const getProjects = () => {
    return fetch('/projects')
      .then(response => response.json());
  };

  const getTasks = () => {
    return fetch('/tasks')
      .then(response => response.json());
  };

  const getTeam = () => {
    return fetch('/team')
      .then(response => response.json());
  };

  return { getProjects, getTasks, getTeam };
};

```  
   
**b.) Implement Error Handling in Micro Front-Ends**  
   
- Update the `dashboard` micro front-end to handle errors gracefully by modifying the `src/app/dashboard/dashboard.component.ts` code as follows:  
   
```ts  
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { apiServiceInstance } from '@projectmgt/sharedstate';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  tasks: any[] = [];
  team: any[] = [];
  error: any = null;

  constructor() {}

  ngOnInit() {
    apiServiceInstance.getProjects().then((data: any) => {
      this.projects = data;
    }).catch((error: any) => {
      this.error = 'Failed to load projects.';
    });

    apiServiceInstance.getTasks().then((data: any) => {
      this.tasks = data;
    }).catch((error: any) => {
      this.error = 'Failed to load tasks.';
    });

    apiServiceInstance.getTeam().then((data: any) => {
      this.team = data;
    }).catch((error: any) => {
      this.error = 'Failed to load team.';
    });
  }

}

```  
   
- Update the `src/app/dashboard/dashboard.component.html` to display error messages:  
   
```html  
<div class="container mt-4">
  <h2>Dashboard</h2>
  <div class="alert alert-danger" *ngIf="error">
    {{ error }}
  </div>
  <div class="row" *ngIf="!error">
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">Projects</div>
        <div class="card-body">
          <ul>
            <li *ngFor="let project of projects">
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
            <li *ngFor="let task of tasks">
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
            <li *ngFor="let member of team">
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
   
In this session, we covered advanced features such as implementing API calls, inter-application communication, error handling, and using NgRx for state management in micro front-end applications using Angular and Single-SPA. We created an API service to fetch data, implemented custom events for inter-application communication, added error handling to provide a robust user experience, and used NgRx to manage and share state across different micro front-ends. These advanced features are essential for building dynamic and resilient micro front-end applications.  
   
### Additional Resources  
   
- [Single-SPA Documentation on API Calls](https://single-spa.js.org/docs/api)  
- [Angular HTTP Client Guide](https://angular.dev/guide/http)  
- [Custom Events in JavaScript](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)  
- [Handling request failure in Angular](https://angular.dev/guide/http/making-requests#handling-request-failure)  
- [NgRx Documentation](https://ngrx.io/docs)  