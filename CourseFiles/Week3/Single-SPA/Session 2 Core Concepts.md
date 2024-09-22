## Session 2: Core Concepts in Single-SPA and Angular (45 minutes)

In this session, we will dive into some core concepts necessary for building robust micro front-end applications using Angular and Single-SPA. These concepts include routing, state management, and form handling. Understanding and implementing these concepts will help you build scalable and maintainable micro front-end applications.

### Key Concepts

#### Routing

Routing allows users to navigate between different views or components in an application. In a micro front-end architecture, each micro front-end can have its own routing configuration.

#### State Management

State management is crucial for maintaining and sharing state across different micro front-ends. It ensures that different parts of your application remain consistent and up-to-date.

#### Form Handling

Forms are essential for user interaction within an application. Proper form handling includes creating forms, validating inputs, and managing form submissions.

### Additional Reading Resources

- [Single-SPA Documentation on Routing](https://single-spa.js.org/docs/configuration)
- [Angular Routing Guide](https://angular.dev/guide/routing)
- [State Management in Angular](https://dev.to/chintanonweb/angular-state-management-a-comparison-of-the-different-options-available-100e)
- [Form Handling in Angular](https://angular.dev/guide/forms)  


### 1. Implementing Routing within Micro Front-Ends

Routing allows users to navigate between different views or components in an application. In a micro front-end architecture, each micro front-end can have its own routing configuration.

#### Create Routes for Different Components

**a.) Update the Dashboard Micro-Frontend**

- Open the `dashboard` micro front-end directory.

- Generate the `HelpSectionComponent`:  
   Use Angular CLI to generate the `HelpSectionComponent`:
  ```bash
  ng generate component help-section
  ```
- Modify the `HelpSectionComponent`: Once the component is generated, you can modify the content to explain how users can interpret the visualizations on the dashboard.  
  `help-section.component.ts:`:

  ```ts
  import { Component } from "@angular/core";

  @Component({
    selector: "app-help-section",
    standalone: true,
    imports: [],
    template: `<h2>Help Section</h2>
      <p>Here you can interpret dashboard visualizations.</p>`,
    styleUrl: "./help-section.component.css",
  })
  export class HelpSectionComponent {}
  ```

- Update the route configuration: Now that the `HelpSectionComponent` is created, we need to add it to the routing configuration.  
  `app.routes.ts:`

  ```ts
  import { Routes } from "@angular/router";
  import { DashboardComponent } from "./dashboard/dashboard.component";
  import { HelpSectionComponent } from "./help-section/help-section.component";

  export const routes: Routes = [
    { path: "", component: DashboardComponent }, // Default route renders DashboardComponent
    { path: "help", component: HelpSectionComponent }, // Help route renders HelpComponent
    { path: "**", redirectTo: "" }, // On any other - redirect to dashboard
  ];
  ```

- Setup `app.component.ts`:

  ```ts
  import { Component } from "@angular/core";
  import { RouterOutlet } from "@angular/router";

  @Component({
    selector: "app-dashboard-root",
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
    styleUrl: "./app.component.css",
  })
  export class AppComponent {}
  ```

- Next, ensure that the Single-SPA integration is configured properly for routing and lifecycle management:  
  `main.single-spa.ts` (Single-SPA entry point):

  ```ts
  import { ApplicationConfig, enableProdMode, NgZone } from "@angular/core";
  import { Router, NavigationStart, provideRouter } from "@angular/router";
  import {
    singleSpaAngular,
    getSingleSpaExtraProviders,
  } from "single-spa-angular";
  import { environment } from "./environments/environment";
  import { singleSpaPropsSubject } from "./single-spa/single-spa-props";
  import { APP_BASE_HREF } from "@angular/common";
  import { bootstrapApplication } from "@angular/platform-browser";
  import { AppComponent } from "./app/app.component";
  import { routes } from "./app/app.routes";

  if (environment.production) {
    enableProdMode();
  }

  const lifecycles = singleSpaAngular({
    bootstrapFunction: (singleSpaProps) => {
      singleSpaPropsSubject.next(singleSpaProps);

      const appConfig: ApplicationConfig = {
        providers: [
          { provide: APP_BASE_HREF, useValue: "/dashboard" }, // Base path for routing
          getSingleSpaExtraProviders(),
          provideRouter(routes), // Provide routing setup
        ],
      };

      return bootstrapApplication(AppComponent, appConfig);
    },
    template: "<app-dashboard-root>",
    Router,
    NavigationStart,
    NgZone,
  });

  export const bootstrap = lifecycles.bootstrap;
  export const mount = lifecycles.mount;
  export const unmount = lifecycles.unmount;
  ```

The routes are defined as follows:

- `''`: When the URL is `/dashboard`, the `DashboardComponent` is rendered.
- `'help'`: When the URL is `/dashboard/help`, the `HelpSectionComponent` is rendered.
- `'**'`: If the URL does not match any of the defined routes, the application `redirects to /dashboard`.

**b.) Repeat Similar Steps for Other Micro Front-Ends**

Follow the same steps for the `projects`, `tasks`, and `team` microfrontends, creating appropriate route configurations for the components you created in Session 1 and updating the `src/main.single-spa.ts` files in each microfrontend directory as you have done in step 1a above.

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

In a micro front-end architecture, sharing state between different micro front-ends is crucial for maintaining consistency across the application. In this section, we'll implement a shared state service using Angular, RxJS BehaviorSubject, and the global window object to share state between micro front-ends

#### Create a Shared State Service

**a.) Initialize Shared State in the Navbar Micro Front-End**

Since the `navbar` micro front-end is likely to be loaded first, we'll initialize the shared state service here.

`navbar/src/app/shared-state.service.ts` in Navbar Micro Front-End:

```ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Mock data
const projects = [
  {
    id: 1,
    name: "Project Alpha",
    description: "Description of Project Alpha",
    date: "2023-01-01",
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Description of Project Beta",
    date: "2023-02-01",
  },
  // Add more projects as needed
];

const tasks = [
  { id: 1, projectId: 1, name: "Design Mockups", status: "Completed" },
  { id: 2, projectId: 2, name: "API Integration", status: "In Progress" },
  // Add more tasks as needed
];

const teams = [
  { id: 1, name: "Team Alpha", members: ["John Doe", "Jane Smith"] },
  { id: 2, name: "Team Beta", members: ["Alice Johnson", "Bob Brown"] },
  // Add more teams as needed
];

const dashboardState = {
  totalProjects: projects.length,
  totalTasks: tasks.length,
  totalTeamMembers: teams.length,
  projects: projects,
  tasks: tasks,
  teams: teams,
};

@Injectable({
  providedIn: "root",
})
export class SharedStateService {
  private stateSubject: BehaviorSubject<any>;
  private window: any = window;

  constructor() {
    if (!this.window.sharedState$) {
      // Initialize the shared state with dashboard data
      this.stateSubject = new BehaviorSubject<any>({
        dashboard: dashboardState,
      });
      this.window.sharedState$ = this.stateSubject;
    } else {
      this.stateSubject = this.window.sharedState$;
      // Update the shared state with dashboard data
      this.stateSubject.next({
        ...this.stateSubject.value,
        dashboard: dashboardState,
      });
    }
  }

  getState(key: string) {
    return this.stateSubject.value[key];
  }

  getStateObservable() {
    return this.stateSubject.asObservable();
  }

  setState(key: string, value: any) {
    this.stateSubject.next({ ...this.stateSubject.value, [key]: value });
  }
}
```

**Explanation:**

- We initialize mock data for `projects`, `tasks`, and `teams`.
- We create `dashboardState` containing aggregate information and the mock data.
- In the constructor, we check if `window.sharedState$` exists:
  - If it doesn't, we initialize a new `BehaviorSubject` with the `dashboardState` and assign it to `window.sharedState$`.
  - If it does, we update the existing `BehaviorSubject` with the new `dashboardState`.
- We provide methods `getState`, `getStateObservable`, and `setState` to interact with the shared state.

Feel free to modify the state and mock data to your liking.

**b.) Create Shared State Service in Other Micro Front-Ends**  
In other micro front-ends (`dashboard`, `projects`, `tasks`, `team`), we'll create a shared state service that connects to the same `BehaviorSubject` on the `window` object.

```ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SharedStateService {
  private stateSubject: BehaviorSubject<any>;
  private window: any = window;

  constructor() {
    if (!this.window.sharedState$) {
      // Initialize with an empty state if not already initialized
      this.stateSubject = new BehaviorSubject<any>({});
      this.window.sharedState$ = this.stateSubject;
    } else {
      this.stateSubject = this.window.sharedState$;
    }
  }

  getState(key: string) {
    return this.stateSubject.value[key];
  }

  getStateObservable() {
    return this.stateSubject.asObservable();
  }

  setState(key: string, value: any) {
    this.stateSubject.next({ ...this.stateSubject.value, [key]: value });
  }
}
```

- Explanation:
  - In the constructor, we check if `window.sharedState$` exists:
    - If it doesn't, we initialize it with an empty `BehaviorSubject`.
    - If it does, we use the existing `BehaviorSubject`.
  - This ensures that all micro front-ends are connected to the same shared state.

**c.) Use the Shared State Service in Micro Front-Ends**

In the Dashboard Micro Front-End `src/app/dashboard/dashboard.component.ts:`

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharedStateService } from "../shared-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects: any[] = [];
  tasks: any[] = [];
  teams: any[] = [];
  private subscription: Subscription | undefined;

  constructor(private sharedStateService: SharedStateService) {}

  ngOnInit() {
    // Subscribe to the shared state
    this.subscription = this.sharedStateService
      .getStateObservable()
      .subscribe((state) => {
        if (state && state.dashboard) {
          this.projects = state.dashboard.projects;
          this.tasks = state.dashboard.tasks;
          this.teams = state.dashboard.teams;
        }
      });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

`dashboard.component.html:`

```html
<div class="container mt-4">
  <div class="row">
    <!-- Project Summary Card -->
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">Project Summary</div>
        <div class="card-body">
          <h5 class="card-title">Total Projects</h5>
          <p class="card-text display-4">{{ projects.length }}</p>
          <a href="/projects" class="btn btn-primary">View Projects</a>
        </div>
      </div>
    </div>
    <!-- Task Summary Card -->
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">Task Summary</div>
        <div class="card-body">
          <h5 class="card-title">Total Tasks</h5>
          <p class="card-text display-4">{{ tasks.length }}</p>
          <a href="/tasks" class="btn btn-primary">View Tasks</a>
        </div>
      </div>
    </div>
    <!-- Team Summary Card -->
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">Team Summary</div>
        <div class="card-body">
          <h5 class="card-title">Total Team Members</h5>
          <p class="card-text display-4">{{ teams.length }}</p>
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

**Explanation:**

- In the `ngOnInit` lifecycle hook, we subscribe to the shared state observable.
- Whenever the state changes, we update the `projects`, `tasks`, and `team` properties.
- In the template, we display the data using Angular's data binding and `*ngFor` directives.
- We ensure to unsubscribe in `ngOnDestroy` to prevent memory leaks.

**In Other Micro Front-Ends (e.g., `projects`, `tasks`, `team`)**

- Inject the `SharedStateService` in the components where you need access to the shared state.
- Subscribe to the `getStateObservable()` method to receive updates.
- Use the `getState(key)` method to get the current state for a specific key.
- Use the `setState(key, value)` method to update the state.

Example in `projects/src/app/app.component.ts` (if you haven't changed the router):

```ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedStateService } from "../shared-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-projects",
  standalone: true,
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css"],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: any[] = [];
  private subscription: Subscription;

  constructor(private sharedStateService: SharedStateService) {}

  ngOnInit() {
    this.subscription = this.sharedStateService
      .getStateObservable()
      .subscribe((state) => {
        if (state && state.dashboard) {
          this.projects = state.dashboard.projects;
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

(Optional) Repeat the process above for the remaining microfrontends:

- Create a Mock API and expose the data to be used in the microfrontend and update `src/app/shared-state.service.js` as you did in Step 2a above
- Follow the same process as in step 2c above and update components in your microfrontend to use the APIs in the shared state.

### 3. Form Handling

Forms are essential for user interaction within an application. We will create a form to add new projects.

#### Create and Manage Forms

**a.) Create a Form Component in the Projects Micro-Frontend**

- In the `projects` micro front-end, create or update the file named `src/app/app.component.html` and add the following code:

```html
<div class="container mt-4">
  <h2>Projects</h2>
  <form (ngSubmit)="addProject()" #projectForm="ngForm" novalidate>
    <div class="form-group">
      <label for="projectName">Project Name:</label>
      <input
        type="text"
        id="projectName"
        name="projectName"
        class="form-control"
        [(ngModel)]="newProject.name"
        required
      />
      <div
        class="invalid-feedback"
        *ngIf="projectForm.submitted && projectForm.form.controls['projectName']?.invalid"
      >
        Project name is required.
      </div>
    </div>
    <div class="form-group">
      <label for="projectDescription">Project Description:</label>
      <textarea
        id="projectDescription"
        name="projectDescription"
        class="form-control"
        [(ngModel)]="newProject.description"
        required
      ></textarea>
      <div
        class="invalid-feedback"
        *ngIf="projectForm.submitted && projectForm.form.controls['projectDescription']?.invalid"
      >
        Project description is required.
      </div>
    </div>
    <br />
    <button
      type="submit"
      class="btn btn-primary"
      [disabled]="projectForm.form.invalid"
    >
      Add Project
    </button>
  </form>

  <h3 class="mt-4">Project List</h3>
  <ul class="list-group">
    <li class="list-group-item" *ngFor="let project of projects">
      <strong>{{ project.name }}</strong>: {{ project.description }}
    </li>
  </ul>
</div>
```

Update the `src/app/app.component.ts` to use the shared state:

```ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedStateService } from "./shared-state.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, FormsModule], // Import necessary modules here
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit, OnDestroy {
  projects: any[] = [];
  newProject: any = {};

  private subscription: Subscription | undefined;

  constructor(private sharedStateService: SharedStateService) {}

  ngOnInit() {
    this.subscription = this.sharedStateService
      .getStateObservable()
      .subscribe((state) => {
        if (state?.projects) {
          this.projects = state.projects;
        }
      });
  }

  addProject() {
    if (this.newProject.name && this.newProject.description) {
      this.projects.push(this.newProject);
      this.sharedStateService.setState("projects", this.projects); // Update state
      this.newProject = {}; // Reset form
    } else {
      console.log("Form is invalid");
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

- In a terminal window, navigate to the projects directory
- Run `npm run start`
- Add the projects microfrontend module url to the import map in the root config project `src\index.ejs` file e.g.

  ```javascript
    <% if (isLocal) { %>
  <script type="systemjs-importmap">
    {
      "imports": {
        "@projectmgt/root-config": "//localhost:9000/projectmgt-root-config.js",
        "@projectmgt/navigation": "http://localhost:8080/main.js",
        "@projectmgt/welcome": "http://localhost:8081/main.js",
        "@projectmgt/dashboard": "http://localhost:8082/main.js",
        "@projectmgt/projects": "http://localhost:8084/main.js"
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

During this exercise, you created a shared state using RxJS `BehaviorSubject`. Your next challenge will be to use `NgRx` to simplify application state across the microfrontends. This is extra tasks outside this lab exercise.

### Summary

In this session, we covered key concepts such as routing, state management, and form handling in micro front-end applications using **Angular** and **Single-SPA**. We implemented routing for different components, created a shared state service for managing state across micro front-ends, and built a form for user interaction. These concepts are essential for building scalable and maintainable micro front-end applications. Remember to explore the additional reading resources provided to deepen your understanding of these concepts.

### Additional Resources

- [Single-SPA Documentation on Routing](https://single-spa.js.org/docs/configuration)
- [Angular Routing Guide](https://angular.dev/guide/routing)
- [State Management in Angular with NgRx](https://ngrx.io/guide/store)
- [Form Handling in Angular](https://angular.dev/guide/forms)
