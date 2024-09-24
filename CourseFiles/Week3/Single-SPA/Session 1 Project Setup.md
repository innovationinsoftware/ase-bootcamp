## Session 1: Single-SPA Angular Project Setup (60 minutes)  

### 1. Environment Setup  

#### Install Node.js and Angular CLI  
To start with, you need to have Node.js and npm installed on your machine. You can download and install Node.js from [Node.js official website](https://nodejs.org/) (v20.* recommended).  

Next, install the Angular CLI globally using npm:  
```bash  
npm install -g @angular/cli  
```

#### Clone the Starter Repository

We will use a starter project that contains the base configuration and six micro front-ends:

- dashboard
- navbar
- projects
- tasks
- team
- welcome

These are located in the `projectmgt` folder, and the root Single-SPA project is in the root directory.

Navigate into the project directory:
```bash  
cd lab-angular
```
### 2. Overview of the Base Project

Since the project is already set up, we don’t need to initialize or create new applications. Instead, let's focus on the key files that make up the project structure:

#### Project Structure

Here is a breakdown of the important files and folders in the base project:

- **`projectmgt/`**: This folder contains the micro front-ends.
  - Each micro front-end (e.g., `dashboard`, `navbar`, `projects`) has its own Angular standalone application.
  - Inside each micro front-end, you'll find:
    - **`src/app`**: Contains the main component files for the micro front-end.
    - **`angular.json`**: Angular configuration specific to the micro front-end.
    - **`main.single-spa.ts`**: Entry point file used to integrate the Angular application with Single-SPA.

- **`src/`**: This folder contains the Single-SPA root configuration.
  - **`src/index.ejs`**: This is the HTML template that serves as the entry point for the application. It defines where the micro front-ends will be loaded.
  - **`src/projectmgt-root-config.js`**: This is the configuration file that registers each micro front-end with Single-SPA.
  - **`src/microfrontend-layout.html`**: This file defines the layout structure for the Single-SPA application, specifying where each micro front-end should be loaded.

#### Root Files

- **`package.json`**: Lists the dependencies and scripts for managing the root project.
- **`webpack.config.js`**: Handles the Webpack configuration for the Single-SPA project, including the bundling and loading of micro front-ends.


Install the dependencies:  
```bash  
npm install  
```


For the purpose of this exercise, we will use Bootstrap for styling. You can add the latest Bootstrap CDN reference in the head of the `src\index.ejs` file. Alternatively, you can use a different UI framework and adjust the application layout accordingly. Below is an example of using bootstrap in `src\index.ejs`:

```html
 <title>Root Config</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
```

The `root-config.js` file will register and construct the Angular micro front-end applications that you will define in the SystemJS import map file in the `index.ejs` file. The `microfrontend-layout.html` contains the Single-SPA layout definition for your application. You can learn more about layout definitions [here](https://single-spa.js.org/docs/layout-definition/).  

For additional reading on setting up the root config, refer to the [Single-SPA documentation](https://single-spa.js.org/docs/getting-started-overview/).


### 3. Configure Single-SPA  

#### Integrate Angular Applications into the Single-SPA Root Config  
Open the `lab-angular/src/index.ejs` file and register your micro front-ends using the SystemJS import map. Each micro frontend registration references the webpack bundle located at the address where the frontend is running:  

```html  
    <% if (isLocal) { %>
  <script type="systemjs-importmap">
    {
      "imports": {
        "@projectmgt/root-config": "//localhost:9000/projectmgt-root-config.js",
        "@projectmgt/navigation": "//localhost:8080/main.js",
        "@projectmgt/welcome": "//localhost:8081/main.js",
        "@projectmgt/dashboard": "//localhost:8082/main.js",
        "@projectmgt/sharedstate": "//localhost:8083/main.js",
        "@projectmgt/projects": "//localhost:8084/main.js",
        "@projectmgt/team": "//localhost:8085/main.js",
        "@projectmgt/tasks": "//localhost:8086/main.js"
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
Make sure you have added bootstrap or referenced the UI libraries of your choice in the `lab-angular\src\index.ejs` file of the root project.

#### Create Navigation and Application Shell  

**a.) Update the navbar microfrontend**

In the navbar micro front-end, update `src/app/app.component.ts`:  

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
        <a class="nav-link" href="/tasks">Tasks</a>  
      </li>  
      <li class="nav-item">  
        <a class="nav-link" href="/team">Team</a>  
      </li>  
    </ul>  
  </div>  
</nav>  
```

Update `navbar/src/app/app.component.ts` with the following code:
```javascript
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    console.log('Navigation component initialized');
  }
}

```



**b.) Add navigation to the lab-angular root application**

Open the `lab-angular/src/microfrontend-layout.html` file and update the code layout definition to the following:

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
For each micro front-end, create basic components to display some sample data. **Use your imagination or ChatGPT to generate the UI for the components in the frontend**. For example, in the `dashboard` micro front-end directory, create a new component `/dashboard/src/app/app.component.ts`:  
```javascript  
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedDataService } from './shared-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  projects: any[] = [];
  tasks: any[] = [];
  team: any[] = [];

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    console.log('Dashboard component initialized');
    this.sharedDataService.projects$.subscribe((projects) => (this.projects = projects));
    this.sharedDataService.tasks$.subscribe((tasks) => (this.tasks = tasks));
    this.sharedDataService.team$.subscribe((team) => (this.team = team));
  }
}

```

Create a new view for the dashboard component `/dashboard/src/app/app.component.html` and add the following code:

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
          <p class="card-text display-4">{{ team.length }}</p>
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

Repeat similar steps for the `project`, `task`, and `team` micro front-ends and create the components and their views. Use your imagination in creating these components.

### 5. Serve and Run the Application  

#### Serve Micro Front-Ends  
Navigate to each micro front-end directory and build the application:  
```bash  
cd navbar  
npm run start  
cd ../welcome  
npm run start  
cd ../dashboard  
npm run start  
cd ../projects
npm run start
cd ../tasks
npm run start
cd ../team  
npm run start  
cd ..  
```

Or use the script `npm-run-start-for-all.ps1` in `projectmgt` folder 

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
In this session, you set up the development environment, created the base project with Single-SPA root config, and configured Angular micro front-ends. Additionally, you set up shared dependencies such as Bootstrap for consistent styling, a mock API module to simulate backend API calls, and built a basic UI for each micro front-end. Finally, you built and ran the application. You are now ready to proceed to the next session where you will implement core concepts such as routing, state management, and form handling.  
