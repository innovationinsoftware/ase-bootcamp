### Part 4: Optimization and Best Practices  

#### 7. Optimizing Docker Images (30 minutes)  

##### **Step 1: Best Practices for Dockerfile**  

1. **Angular Application**  
   - Ensure multi-stage builds to keep the final image size minimal.  
   - Use the official `node` and `nginx` images.  
     
   
   Example `angular-app/Dockerfile`:  
   ```Dockerfile  
        # Stage 1: Build the Angular application
        FROM node:alpine as build
   
        # Set the working directory inside the container
        WORKDIR /app
   
        # Copy the package.json and package-lock.json files to the working directory
        COPY package*.json ./
   
        # Install the dependencies
        RUN npm install
   
        # Copy the rest of the application code to the working directory
        COPY . .
   
        ARG configuration=production
        
       # Install Angular CLI globally
       RUN npm install -g @angular/cli
   
       # Build the Angular app
       RUN npm run build -- --configuration $configuration
   
       # Stage 2: Serve the Angular application
       FROM nginx:alpine
   
       # Copy the built Angular app from the previous stage
       COPY --from=build /app/dist/angular-app/browser/ /usr/share/nginx/html
   
       # Expose the port on which the app will run
       EXPOSE 80
   
       # Start the Nginx server
       CMD ["nginx", "-g", "daemon off;"]
   ```

2. **ExpressJS Application**  
   - Use a lighter base image like `node:18-alpine`.  
   - Copy only necessary files to keep the image size minimal.  
   
   Example `express-server/Dockerfile`:  

   ```  
        # Use a base image with Node.js
        FROM node:18-alpine  
   
        # Install dependencies for sqlite3
        RUN apk add --no-cache \
            g++ \
            make \
            python3 \
            sqlite
   
        # Set the working directory
        WORKDIR /app
   
        # Copy package.json and package-lock.json
        COPY package*.json ./
   
        # Install Node.js dependencies
        RUN npm install
   
        # Copy the rest of the application code
        COPY . .
   
        # Expose the port on which the application will run
        EXPOSE 3000
   
        # Start the application
        CMD [ "npm", "start" ]
   ```

3. **Flask API**  
   - Use a minimal base image like `python:3.10-slim`.  
   - Avoid installing unnecessary packages.  
     
   
   Example `flask-api/Dockerfile`:  
   ```Dockerfile  
   FROM python:3.10-slim  
   WORKDIR /app  
   COPY requirements.txt ./  
   RUN pip install --no-cache-dir -r requirements.txt  
   COPY . .  
   EXPOSE 5000  
   CMD ["python", "app.py"]  
   ```
   - For the Dockerfile to work correctly, you will have to add a `flask-api\requirements.txt` file to the flask-api directory with the following text:
    ```
        flask
        flask-cors
        requests
    ```
   
##### **Step 2: Minimizing Image Size**  

- **Angular**: Use multi-stage builds to avoid including development dependencies in the final image.  
- **ExpressJS and Flask**: Use lightweight base images (`alpine`, `slim`) and avoid installing unnecessary packages.  
  
##### **Step 3: Caching and Multi-Stage Builds**  

- Use Docker’s build cache effectively by ordering Dockerfile commands to maximize cache hits.  
- Leverage multi-stage builds to separate build-time and runtime dependencies.  
  
#### 8. Managing Containers in Production (30 minutes)  

##### **Step 1: Monitoring and Logging**  

- **Docker Logs**: Use `docker logs` to view logs from running containers.  
  ```bash  
  docker logs <container_id>  
  ```
- **Monitoring Tools**: Consider using monitoring tools like Prometheus, Grafana, or ELK Stack for production environments.  
  
##### **Step 2: Restart Policies**  

- Configure restart policies in `docker-compose.yml` to ensure containers automatically restart on failure.  
  
  Example:  
  ```yaml  
  services:  
    express-server:  
      build: ./express-server  
      ports:  
        - "3000:3000"  
      networks:  
        - app-network  
      depends_on:  
        - flask-api  
        - sqlite-db  
      restart: always  
  ```
  
##### **Step 3: Scaling Services**  

- Scale services to handle increased load by using Docker Compose’s scaling feature.  
  
  - We must change the port so it's dynamically mapped for each replica of our `express-server` service.
  
  Example:  
  
  ```dockerfile
  services:  
    express-server:  
      build: ./express-server  
      ports:  
        - "3000"  
      networks:  
        - app-network  
      depends_on:  
        - flask-api  
        - sqlite-db  
      restart: always  
  ```
  
  
  
  ```bash  
  docker-compose up --scale express-server=3  
  ```
  
### Optimized `docker-compose.yml` File  

```yaml  
services:  
  angular-app:  
    build: ./angular-app  
    ports:  
      - "4200:4200"  
    networks:  
      - app-network  
    restart: always 

  express-server:  
    build: ./express-server  
    ports:  
      - "3000"  
    networks:  
      - app-network  
    depends_on:  
      - flask-api  
      - sqlite-db  
    restart: always 

  flask-api:  
    build: ./flask-api  
    ports:  
      - "5000:5000"  
    networks:  
      - app-network  
    restart: always 

  sqlite-db:  
    image: nouchka/sqlite3  
    volumes:  
      - ./database:/data  
    networks:  
      - app-network  
    restart: always  
networks:  
  app-network:  
    driver: bridge   
```

### Next Steps  

Proceed to Part 5 where you will test the application and ensure that all components are functioning as expected, and troubleshoot any issues that arise.