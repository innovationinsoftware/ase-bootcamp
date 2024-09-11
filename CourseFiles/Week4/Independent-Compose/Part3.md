### Part 3: Orchestrating with Docker Compose  

#### 6. Setting Up Docker Compose (30 minutes)  

##### **Step 1: Define Services in `docker-compose.yml`**  

1. **Create `docker-compose.yml` file**  
   - Navigate to the root directory of your project `multi-container-app` and create a `docker-compose.yml` file:  
     ```bash  
     cd ../multi-container-app  
     touch docker-compose.yml  
     ```
   
2. **Define Services for Angular, Express, Flask, and SQLite**  
   - Open the `docker-compose.yml` file and add the following configuration:  
     ```yaml  
     services:  
       angular-app:  
         build: ./angular-app  
         ports:  
           - "4200:4200"  
         networks:  
           - app-network  
      
       express-server:  
         build: ./express-server  
         ports:  
           - "3000:3000"  
         networks:  
           - app-network  
         depends_on:  
           - flask-api  
           - sqlite-db  
      
       flask-api:  
         build: ./flask-api  
         ports:  
           - "5000:5000"  
         networks:  
           - app-network  
      
       sqlite-db:  
         image: nouchka/sqlite3  
         volumes:  
           - ./database:/data  
         networks:  
           - app-network  
      
     networks:  
       app-network:  
         driver: bridge  
     ```
   
##### **Step 2: Configure Inter-Container Communication**  

- Ensure that each service in the `docker-compose.yml` file is starts in this order: 
  - `sqlite-db`
  - `flask-api`
  - `express-server`
  - `angular-app`
##### **Step 3: Build and Run Multi-Container Application Using Docker Compose**  

1. **Build All Services**  
   - From the root directory of your project, run:  
     ```bash  
     docker-compose build  
     ```
   
2. **Start All Services**  
   - Run the following command to start all the services:  
     ```bash  
     docker-compose up  
     ```
   
3. **Verify Services are Running**  
   - Open your browser and navigate to `http://localhost:4200` to access the Angular front-end.  
   - Ensure that you can input a query and receive a generated response from the backend.  
   
4. **Testing Inter-Container Communication**  
   - Ensure that the Angular front-end can communicate with the ExpressJS server.  
   - Ensure that the ExpressJS server can communicate with both the Flask API and the SQLite database.  
   
### Final `docker-compose.yml` File  

```yaml  
version: '3.8'  
   
services:  
  angular-app:  
    build: ./angular-app  
    ports:  
      - "4200:4200"  
    networks:  
      - app-network  
  
  express-server:  
    build: ./express-server  
    ports:  
      - "3000:3000"  
    networks:  
      - app-network  
    depends_on:  
      - flask-api  
      - sqlite-db  
  
  flask-api:  
    build: ./flask-api  
    ports:  
      - "5000:5000"  
    networks:  
      - app-network  
  
  sqlite-db:  
    image: nouchka/sqlite3  
    volumes:  
      - ./database:/data  
    networks:  
      - app-network  
   
networks:  
  app-network:  
    driver: bridge  
```

### Next Steps  

Proceed to Part 4 where you will focus on optimizing Docker images and ensuring best practices for production environments.