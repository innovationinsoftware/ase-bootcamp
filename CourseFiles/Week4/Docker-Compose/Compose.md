### Building and Running a Multi-Container Application with Docker Compose

In this lab, we will build a complete multi-container application using Docker Compose, consisting of an Angular frontend, a Node.js backend, and an SQLite database. You'll learn how to:

- Dockerize both the frontend and backend applications.
- Configure and run a multi-container setup using Docker Compose.
- Interact with Docker Compose commands (`logs`, `ps`, `down`, etc.).
- Inspect Docker networks and volumes.
- Integrate and explore common Docker Compose features like environment variables and health checks.

---

### Prerequisites

This lab requires support files. They are located in the same directory as the lab guide. Please add the GitHub repository to Visual Studio Code and use it to complete the lab.



### **Step 1: Application Overview**

The multi-container application includes the following components:
- **Frontend**: An Angular application that fetches visitor data from the backend.
- **Backend**: A Node.js application that serves an API to manage visitor data using an in-memory SQLite database.
- **Database**: A lightweight SQLite database used to store visitor data.

#### Frontend Files:

##### **frontend/src/app/app.component.ts**
This is the core component of the Angular frontend. It initializes the frontend by fetching visitor data from the backend using a service and displays it.

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisitorsService } from './visitors.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-container-app';
  visitors: any[] = [];

  constructor(private visitorsService: VisitorsService) { }

  ngOnInit(): void {
    // Fetch visitors data from the backend API via the VisitorsService
    this.visitorsService.getVisitors().subscribe(data => {
      this.visitors = data;
    });
  }
}
```

**Explanation:**
- **VisitorsService**: The `VisitorsService` fetches visitor data from the backend API (`/api/visitors`).
- **ngOnInit**: When the component initializes, it calls the `getVisitors` method to populate the `visitors` array with data retrieved from the backend.
- **Display**: The visitor data is displayed in the template using Angular's `*ngFor` directive.

##### **frontend/src/app/app.config.ts**
This file sets up key application configurations like routing and HTTP services.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

**Explanation:**
- **provideZoneChangeDetection**: Optimizes Angular's change detection, batching events together to reduce unnecessary processing.
- **provideRouter**: Sets up routing in the Angular app.
- **provideHttpClient**: Configures Angular’s HTTP client for use across the application, allowing for communication with the backend.

#### Backend Files:

##### **backend/server.js**
This is the backend server for the application, built using Node.js and Express. It creates an in-memory SQLite database and serves a REST API to manage visitor data.

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

const db = new sqlite3.Database(':memory:');

app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE visitors (id INT, name TEXT)");

  const stmt = db.prepare("INSERT INTO visitors VALUES (?, ?)");
  stmt.run(1, "John Doe");
  stmt.finalize();
});

// API route to get all visitors from the database
app.get('/api/visitors', (req, res) => {
  db.all("SELECT * FROM visitors", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

**Explanation:**
- **SQLite3 Database**: The database is stored in memory and initialized with a single table (`visitors`), pre-populated with sample data.
- **API Endpoint**: The `/api/visitors` endpoint retrieves all visitors from the database and sends them as a JSON response to the frontend.
- **CORS**: Enabled to allow cross-origin requests, allowing the frontend to communicate with the backend API.

---

### **Step 2: Dockerizing the Application**
#### Frontend Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g @angular/cli
RUN npm run build

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
```

**Explanation**:
- Uses a lightweight Node.js image.
- Installs Angular CLI globally to build and serve the application.
- Exposes port 4200 for the frontend service.

#### Backend Dockerfile:
```dockerfile
FROM node:alpine

RUN apk add --no-cache g++ make python3 sqlite
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
```

**Explanation**:
- Installs the necessary build tools and SQLite3 for database interaction.
- Exposes port 3000 for the backend API.

---

### **Step 3: Docker Compose Configuration**
The `docker-compose.yml` file orchestrates the frontend, backend, and SQLite database.

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:4200"
    depends_on:
      - backend
    networks:
      custom-network:
        aliases:
          - frontend.local
    environment:
      - BACKEND_URL=http://backend.local:3000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - database
    networks:
      custom-network:
        aliases:
          - backend.local
    environment:
      - DATABASE_URL=sqlite:///var/lib/sqlite3/db.sqlite

  database:
    image: nouchka/sqlite3
    volumes:
      - db-data:/var/lib/sqlite3
    networks:
      custom-network:
        aliases:
          - database.local

volumes:
  db-data:

networks:
  custom-network:
```

**Explanation**:
- **frontend**: Builds the frontend image and exposes port 4200.
- **backend**: Builds the backend image and exposes port 3000, depending on the database.
- **database**: Uses the `nouchka/sqlite3` image to provide the SQLite database and persists data using the `db-data` volume.
- **custom-network**: Ensures all services can communicate seamlessly.

---

### **Step 4: Running the Application with Docker Compose**
1. **Build and Start the Application**:
   Run the following command to build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. **Verify the Application**:
   - The Angular frontend should be available at **http://localhost:4200**.
   - The backend API can be accessed directly at **http://localhost:3000/api/visitors**.

---

### **Step 5: Exploring Docker Compose Commands**
1. **Viewing Running Containers**:

   ```bash
   docker-compose ps
   ```

   This shows the state and ports of the running services.

2. **Viewing Logs**:

   ```bash
   docker-compose logs
   ```

   You can view logs for all services or specify one, such as `docker-compose logs backend`.

3. **Stopping and Removing Containers**:

   ```bash
   docker-compose down
   ```

   Stops the services and removes containers and networks, but retains built images.

---

### **Step 6: Inspecting Networks and Volumes**
1. **Inspecting Docker Networks**:

   ```bash
   docker network inspect custom-network
   ```

   Shows detailed information about the network connecting the services.

2. **Inspecting Docker Volumes**:

   ```bash
   docker volume inspect db-data
   ```

   Views information about the volume used by the SQLite database to persist data.

---

### **Summary**
In this lab, you learned how to:
- Build and run a multi-container application using Docker Compose.
- Dockerize an Angular frontend and Node.js backend.
- Explore common Docker Compose commands to manage and inspect services.

This gives you a strong foundation in orchestrating multi-service applications with Docker Compose.
