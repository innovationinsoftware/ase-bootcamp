### Part 1: Introduction and Setup  

#### 1. Introduction (15 minutes)  

##### **Overview of the Lab Objectives**  
- Build a multi-container application using Angular, ExpressJS, and Flask API.  
- Utilize Docker Compose to orchestrate the containers.  
- Apply Docker best practices for image optimization and container management.  
- Ensure inter-container communication and efficient container orchestration.  
  
##### **Brief on the Application Architecture**  
- **Angular Front-End**: Provides the user interface and communicates with the ExpressJS server.  
- **ExpressJS Server**: Acts as middleware, processing requests from Angular and communicating with the Flask API.  
- **Flask API**: Handles data processing and serves data to the ExpressJS server.  
  
##### **Tools and Technologies Required**  
- **Docker**: Container platform  
- **Docker Compose**: Tool for defining and running multi-container Docker applications  
- **Angular**: Front-end framework  
- **Node.js and ExpressJS**: Backend JavaScript runtime and framework  
- **Python and Flask**: Backend Python runtime and framework  
  
#### 2. Environment Setup (30 minutes)  

##### **Install Docker and Docker Compose**  
1. **Docker Installation**  
   - Follow the instructions from the official Docker website to install Docker on your system:  
     - [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)  
     - [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)  
     - [Docker for Linux](https://docs.docker.com/engine/install/)  
   
2. **Docker Compose Installation**  
   - Docker Compose is included in Docker Desktop for Windows and Mac.  
   - For Linux, follow the instructions on the [Docker Compose installation page](https://docs.docker.com/compose/install/).  

   
##### **Verify Installations**  
- Open a terminal or command prompt and run:  
  ```bash  
  docker --version  
  docker-compose --version  
  ```
- You should see output indicating the installed versions of Docker and Docker Compose.  
  
##### **Overview of the Project Structure**  
Create a root directory for the project:  
```bash  
mkdir multi-container-app  
cd multi-container-app  
```

The project structure will be:  
```plaintext  
multi-container-app/  
├── angular-app/  
├── express-server/  
├── flask-api/  
└── docker-compose.yml  
```

- **angular-app/**: Directory for the Angular front-end application.  
- **express-server/**: Directory for the ExpressJS server.  
- **flask-api/**: Directory for the Flask API.  
- **docker-compose.yml**: Docker Compose file to define and run the multi-container application.  
  
### Next Steps  
Proceed to Part 2 where you will start building the application components, beginning with setting up the Angular front-end application.