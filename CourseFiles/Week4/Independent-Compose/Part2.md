#### ExpressJS Server Setup (45 minutes)  

##### **Step 1: Initialize ExpressJS Project**  

1. **Create Express Project**  
   Make sure you in the `multi-container-app` root project directory
   ```bash  
   mkdir express-server  
   cd express-server  
   npm init -y  
   npm install express@latest sqlite3@latest body-parser@latest axios@latest cors
   ```
2. **Set Up SQLite Database**
   - Create a directory for the database
    ```bash
    mkdir database
    ```
    - Create a file `database/data.db` (SQLite will create this file when the database is initialized)   
3. **Create Basic API Endpoints**  
   - Create a file `express-server/index.js`:  
     ```javascript  
        const express = require('express');
        const bodyParser = require('body-parser');
        const sqlite3 = require('sqlite3').verbose();
        const cors = require('cors');
        const app = express(); 
     
        const port = 3000;
        
        // Enable CORS for all routes
        app.use(cors());
        app.use(bodyParser.json());
        
        // Initialize SQLite Database
        const db = new sqlite3.Database('./database/data.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
        });
        
        // Create Grades Table
        db.run(`CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentName TEXT,
        subject TEXT,
        grade TEXT
        )`);
        
        // Add a new grade
        app.post('/api/grades', (req, res) => {
        const { studentName, subject, grade } = req.body;
        db.run(`INSERT INTO grades (studentName, subject, grade) VALUES (?, ?, ?)`, [studentName, subject, grade], function(err) {
            if (err) {
            return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        });
        });
        
        // Get all grades
        app.get('/api/grades', (req, res) => {
        db.all(`SELECT * FROM grades`, [], (err, rows) => {
            if (err) {
            return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
        });
        
        // Get a single grade by ID
        app.get('/api/grades/:id', (req, res) => {
        const { id } = req.params;
        db.get(`SELECT * FROM grades WHERE id = ?`, [id], (err, row) => {
            if (err) {
            return res.status(500).json({ error: err.message });
            }
            res.json(row);
        });
        });
        
        // Update a grade by ID
        app.put('/api/grades/:id', (req, res) => {
        const { id } = req.params;
        const { studentName, subject, grade } = req.body;
        db.run(`UPDATE grades SET studentName = ?, subject = ?, grade = ? WHERE id = ?`, [studentName, subject, grade, id], function(err) {
            if (err) {
            return res.status(500).json({ error: err.message });
            }
            res.json({ changes: this.changes });
        });
        });
        
        // Delete a grade by ID
        app.delete('/api/grades/:id', (req, res) => {
        const { id } = req.params;
        db.run(`DELETE FROM grades WHERE id = ?`, [id], function(err) {
            if (err) {
            return res.status(500).json({ error: err.message });
            }
            res.json({ changes: this.changes });
        });
        });
        
        app.listen(port, () => {
        console.log(`Express server listening at http://localhost:${port}`);
        });
     ```
    - Open `express-js/package.json` in an editor and replace with the following:
      ```json
        {
            "name": "express-server",
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "start": "node index.js", 
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": "",
            "license": "ISC",
            "dependencies": {
                "body-parser": "^1.20.2",
                "express": "^4.19.2",
                "sqlite3": "^5.1.7"
            }
        }
      ```
   
##### **Step 2: Dockerize ExpressJS Application**  

1. **Create Dockerfile for Express**  
   - Create a file `express-server/Dockerfile`:  
     ```Dockerfile  
        # Use a base image with Node.js
        FROM node:alpine
     
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
        CMD [ "npm", "start" ]`
     ```
   - Create a file `express-server/.dockerignore` and add the following line:
        ```
        node_modules/
        ```


#### Flask API Setup (45 minutes)  

##### **Step 1: Initialize Flask Project**  

1. **Create Flask Project**  
   - Open the root directory `multi-container-app` and create a new directory `flask-api` and navigate into it:  
     ```bash  
     mkdir flask-api  
     cd flask-api  
     ```
   
2. **Create Virtual Environment and Install Flask**  
   ```bash  
   python -m venv venv  
   source venv/Scripts/activate  
   pip install flask requests flask-cors
   ```
   
3. **Create Basic API Endpoints**  
   - Create a file `flask-api/app.py`:  
     ```python  
        from flask import Flask, request, jsonify
        from flask_cors import CORS  # Import CORS
        
        app = Flask(__name__)
        CORS(app)  # Enable CORS for the entire app
        
        @app.route('/api/generate', methods=['POST'])
        def generate_text():
            data = request.get_json()
            query = data['query']
        
            # Simulate interaction with Databricks Dolly for text generation
            generated_text = f"Dolly's response to '{query}'"
            return jsonify({'generated_text': generated_text})
        
        if __name__ == '__main__':
            app.run(host='0.0.0.0', port=5000)
     ```
   
##### **Step 2: Dockerize Flask Application**  

1. **Create Dockerfile for Flask**  
   - Create a file `flask-api/Dockerfile`:  
     ```Dockerfile  
     FROM python:3.10-slim  
     WORKDIR /app  
     COPY . .  
     RUN pip install --no-cache-dir flask requests flask-cors
     EXPOSE 5000  
     CMD ["python", "app.py"]  
     ```

#### Angular Front-End Setup (45 minutes)  

##### **Step 1: Initialize Angular Project**  

1. **Install Angular CLI**  
   ```bash  
   npm install -g @angular/cli@latest  
   ```
   
2. **Create Angular Project**  

Make sure you are in the `multi-container-app` directory then run the following command:
   ```bash  
   ng new angular-app  
   cd angular-app  
   ```

Update `src/index.html` to include `bootstrap.css` cdn:
```html
<!doctype html>
 <html lang="en">
 <head>
 <meta charset="utf-8">
 <title>AngularApp</title>
 <base href="/">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="icon" type="image/x-icon" href="favicon.ico">
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
 </head>
 <body>
 <app-root></app-root>
 </body>
 </html>

```

3. **Basic Angular Component**  
   - Generate a new component:  
     ```bash  
     ng generate component grades  
     ```

   - Open `src/app/app.component.ts` in the editor.
   - In `app.component.ts`, import `GradesComponent` by adding this line to the file level imports. 
     ```typescript
     import { GradesComponent } from './grades/grades.component';
     ```
   - In `app.component.ts`, in `@Component`, update the imports array property and add `GradesComponent`
    ```typescript
      imports: [RouterOutlet,GradesComponent],
    ```
   - Open `src/app/app.component.html` in the editor
   - In `<div class="content">` replace with:
     ```html
     <app-grades></app-grades>
     ```

4. **Basic Service to Fetch Data**  
   - Generate a service to fetch data from the ExpressJS server:  
     ```bash  
     ng generate service api  
     ```
     
   - Update `src/app/api.service.ts`:  
     ```typescript  
        import { Injectable } from '@angular/core';
        import { HttpClient } from '@angular/common/http';
        import { Observable } from 'rxjs';
        
        @Injectable({
        providedIn: 'root'
        })
        export class ApiService {
        private expressApiUrl = 'http://localhost:3000/api/grades'; // Adjust the URL as necessary
        private flaskApiUrl = 'http://localhost:5000/api/generate'; // Adjust the URL as necessary
        
        constructor(private http: HttpClient) {}
        
        // ExpressJS API Methods
        getAllGrades(): Observable<any> {
            return this.http.get(this.expressApiUrl);
        }
        
        getGradeById(id: number): Observable<any> {
            return this.http.get(`${this.expressApiUrl}/${id}`);
        }
        
        addGrade(grade: any): Observable<any> {
            return this.http.post(this.expressApiUrl, grade);
        }
        
        updateGrade(id: number, grade: any): Observable<any> {
            return this.http.put(`${this.expressApiUrl}/${id}`, grade);
        }
        
        deleteGrade(id: number): Observable<any> {
            return this.http.delete(`${this.expressApiUrl}/${id}`);
        }
        
        // Flask API Method
        generateText(query: string): Observable<any> {
            return this.http.post(this.flaskApiUrl, { query });
        }
        } 
     ```
   - Open `src/app/grades/grades.component.ts` and use the ApiService to interact with the APIs.
    ```typescript
        import { Component, OnInit } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { ApiService } from '../api.service';
   
        @Component({
        selector: 'app-grades',
        templateUrl: './grades.component.html',
        styleUrls: ['./grades.component.css'],
        imports: [CommonModule] ,
        standalone: true
        })
   
        export class GradesComponent implements OnInit {
          grades: any[] = [];
          generatedText: string = '';
        
          constructor(private apiService: ApiService) {}
        
          ngOnInit(): void {
            this.getAllGrades();
          }
        
          getAllGrades(): void {
            this.apiService.getAllGrades().subscribe((data) => {
              this.grades = data;
            });
          }
        
          addGrade(grade: any): void {
            this.apiService.addGrade(grade).subscribe(() => {
              this.getAllGrades();
            });
          }
        
          updateGrade(id: number, grade: any): void {
            this.apiService.updateGrade(id, grade).subscribe(() => {
              this.getAllGrades();
            });
          }
        
          deleteGrade(id: number): void {
            this.apiService.deleteGrade(id).subscribe(() => {
              this.getAllGrades();
            });
          }
        
          generateText(query: string): void {
            this.apiService.generateText(query).subscribe((data) => {
              this.generatedText = data.generated_text;
            });
          }
        }  
    ```
   - Open `src/app/grades/grades.component.html` and add the necessary HTML to display and interact with the data.
     ```html  
        <div>
        <h2>Grades</h2>
        <ul>
            <li *ngFor="let grade of grades">
            {{ grade.studentName }} - {{ grade.subject }}: {{ grade.grade }}
            <button (click)="deleteGrade(grade.id)">Delete</button>
            </li>
        </ul>
        
        <h3>Add Grade</h3>
        <form (submit)="addGrade({ studentName: studentName.value, subject: subject.value, grade: grade.value })">
            <input #studentName placeholder="Student Name" />
            <input #subject placeholder="Subject" />
            <input #grade placeholder="Grade" />
            <button type="submit">Add</button>
        </form>
        
        <h3>Generate Text</h3>
        <input #query placeholder="Enter query" />
        <button (click)="generateText(query.value)">Generate</button>
        <p>{{ generatedText }}</p>
        </div> 
     ```
    - Open src/app/app.config.ts and ensure HttpClient is imported.
    ```typescript
        import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';
        import { FormsModule } from '@angular/forms';
        import { provideRouter } from '@angular/router';
        import { provideHttpClient } from '@angular/common/http';
   
        import { routes } from './app.routes';
   
        export const appConfig: ApplicationConfig = {
        providers: [
            provideZoneChangeDetection({ eventCoalescing: true }), 
            provideRouter(routes),
            importProvidersFrom(BrowserModule, FormsModule),
            provideHttpClient()
        ]
        };
   
    ```


##### **Step 2: Dockerize Angular Application**  

1. **Create Dockerfile for Angular**  
   - Create a file `angular-app/Dockerfile`:  
     ```Dockerfile  
        # Use the official Node.js image as the base image
        FROM node:alpine
     
        # Set the working directory inside the container
        WORKDIR /app
     
        # Copy the package.json and package-lock.json files to the working directory
        COPY package*.json ./
     
        # Install the dependencies
        RUN npm install
     
        # Copy the rest of the application code to the working directory
        COPY . .
     
        RUN npm install -g @angular/cli
     
        # Build the Angular app
        RUN npm run build
     
        # Expose the port on which the app will run
        EXPOSE 4200
     
        # Start the Angular app
        CMD ["ng", "serve", "--host", "0.0.0.0"]
     ```
   

#### Test the application

##### Instructions to Start the APIs and Frontend from a terminal window

**Step 1: Start the ExpressJS API**
   1. **Navigate to the ExpressJS Project Directory from the multi-container-app root directory**
 ```bash
     cd express-server
 ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the ExpressJS Server**
   ```bash
   npm start
   ```

The ExpressJS server should now be running on http://localhost:3000. You can test it by querying `/api/grades` in Postman or the browser.

**Step 2: Start the Flask API**

1. **Navigate to the Flask Project Directory from the multi-container-app root directory**
   ```bash
   cd flask-api
   ```

2. **Activate a Virtual Environment**
   ```bash
   source venv\Scripts\activate
   ```
3. **Start the Flask Server**
    ```bash
    python app.py
    ```

The Flask server should now be running on http://localhost:5000. You must POST a JSON payload to `/api/generate`. For example. 

```json
{
    "query":"Testing"
}
```



**Step 3: Start the Angular Frontend**
1. **Navigate to the Angular Project Directory from the multi-container-app root directory**
   ```bash
   cd angular-app
   ```
2. Start the Angular Development Server
   ```bash
   npm start
   ```
   The Angular application should now be running on http://localhost:4200.

Open the Angular application and add some records to test.

### Next Steps  

Proceed to Part 3 where you will set up Docker Compose to orchestrate these containers and enable inter-container communication.