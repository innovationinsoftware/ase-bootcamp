# Lab Exercise: Implement and Manage Micro Front-End Applications Using Single-SPA and AngularJS  
  
## Introduction (15 minutes)  
  
### Objective  
The primary objective of this lab exercise is to empower you with the skills to implement and manage micro front-end applications using Single-SPA and AngularJS. By the end of this lab, you will have built a functional Project Management Tool that integrates multiple micro front-ends into a single cohesive application. This tool will leverage shared dependencies such as UI frameworks and mock API modules to provide a seamless development experience.  
  
### Prerequisites  
Before starting this lab, you should have:  
- Basic knowledge of AngularJS  
- Understanding of JavaScript and web development fundamentals  
- Familiarity with Node.js and npm (Node Package Manager)  
  
### Overview of Micro Front-End Architecture  
Micro front-end architecture is an advanced approach to building web applications by composing smaller, independent applications. Each micro front-end can be developed, tested, and deployed independently, often by different teams. This architecture offers several benefits:  
- **Scalability**: Teams can work concurrently on different parts of the application without causing conflicts.  
- **Maintainability**: Smaller codebases are easier to manage, update, and debug.  
- **Technology Agnostic**: Different micro front-ends can be built using different frameworks and technologies, allowing teams to choose the best tool for their specific needs.  
  
### Overview of Single-SPA  
Single-SPA (Single-Single Page Application) is a powerful framework designed to facilitate the development of micro front-end applications. It allows multiple JavaScript frameworks to coexist on the same page, enabling seamless integration of different micro front-ends. Single-SPA provides mechanisms for:  
- **Routing**: Managing navigation between different micro front-ends.  
- **Lifecycle Management**: Handling the loading, mounting, and unmounting of micro front-ends as needed.  
- **Communication**: Enabling communication between different micro front-ends.  
  
### Components of Single-SPA Applications  
A Single-SPA application typically consists of the following components:  
  
1. **Root Config**:  
   - The root configuration is the entry point of the Single-SPA application. It defines the layout and routing for the entire application, specifying which micro front-ends should be loaded at which routes.  
   - Example:  
     ```javascript  
     import { registerApplication, start } from 'single-spa';  
  
     registerApplication(  
       'app1',  
       () => import('app1/main.js'),  
       location => location.pathname.startsWith('/app1')  
     );  
  
     start();  
     ```  
  
2. **Micro Front-Ends**:  
   - These are the individual applications that are integrated into the Single-SPA application. Each micro front-end can be developed using different frameworks and libraries (e.g., AngularJS, React, Vue).  
   - Example:  
     ```javascript  
     // src/main.js for an AngularJS micro front-end  
     import { start } from 'single-spa-angularjs';  
     import angular from 'angular';  
     import './app.module';  
  
     start({  
       angular,  
       domElementGetter: () => document.getElementById('app1'),  
       mainAngularModule: 'app1',  
       uiRouter: true,  
     });  
     ```  
  
3. **Shared Dependencies**:  
   - Shared dependencies are libraries or resources that are used by multiple micro front-ends. These can be loaded once and shared across the entire application to reduce redundancy and improve performance. In this lab, we will use:  
     - **UI Frameworks**: Such as Bootstrap or Tailwind CSS for consistent styling across micro front-ends.  
     - **Mock API Module**: For simulating backend API calls during development.  
   - Example:  
     ```javascript  
     // root-config/src/index.js  
     import 'zone.js';  
     import 'angular';  
     import 'angular-ui-router';  
     import 'bootstrap/dist/css/bootstrap.min.css';  
     import './mock-api'; // Mock API module  
     ```  
  
### Benefits of Using Single-SPA  
- **Independent Deployment**: Each micro front-end can be deployed independently, allowing for faster and more frequent releases.  
- **Improved Collaboration**: Different teams can work on different parts of the application without stepping on each other’s toes.  
- **Flexibility**: Teams can choose the most appropriate technology stack for their specific needs.  
  
### Project Overview: Project Management Tool  
During this lab exercise, you will build a Project Management Tool, a web application designed to help manage projects, tasks, and team members. The tool will include features such as task assignment, progress tracking, and team collaboration. Here's a breakdown of the key concepts you will implement:  
  
- **Routing**: Navigate between different projects, tasks, and team member profiles.  
- **State Management**: Manage shared state for projects, tasks, and team data.  
- **Form Handling**: Create and manage forms for adding/editing tasks and team members.  
- **API Calls**: Fetch and update project and task data from a backend API.  
- **Inter-Application Communication**: Use custom events or shared services for real-time collaboration.  
- **Error Handling**: Implement error handling for API calls and form submissions.  
  
### Features of the Project Management Tool  
1. **Dashboard**:  
   - A central hub displaying an overview of projects, tasks, and team activities.  
   - Example: Summary of ongoing projects, pending tasks, and recent activities.  
  
2. **Project Management**:  
   - Create, view, edit, and delete projects.  
   - Example: Navigate to a specific project's page to see detailed information and associated tasks.  
  
3. **Task Management**:  
   - Assign tasks to team members, set deadlines, and track progress.  
   - Example: Create a new task, assign it to a team member, and update its status.  
  
4. **Team Management**:  
   - Manage team members, their roles, and their profiles.  
   - Example: Add new team members, edit their profiles, and view their assigned tasks.  
  
5. **Real-Time Collaboration**:  
   - Enable team members to collaborate in real-time through shared services and custom events.  
   - Example: Notify team members of task updates or new comments.  
  
6. **Error Handling**:  
   - Implement robust error handling mechanisms to ensure a smooth user experience.  
   - Example: Display user-friendly error messages for failed API calls or invalid form submissions.  
  
### Project Architecture  
The Project Management Tool will be built using a micro front-end architecture powered by Single-SPA. The application will consist of multiple micro front-ends, each responsible for a specific feature or module. These micro front-ends will be integrated into a single application using the Single-SPA framework.  
  

### Summary  
In this lab, you will gain hands-on experience with advanced concepts in micro front-end development using Single-SPA and AngularJS. You will build a fully functional Project Management Tool, applying techniques such as routing, state management, form handling, API integration, inter-application communication, and error handling. By the end of this lab, you will have a deeper understanding of how to architect and manage complex web applications using micro front-end architecture.  
  
---  
  
Feel free to proceed to **Session 1: Project Setup** to begin the lab exercise.  

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
