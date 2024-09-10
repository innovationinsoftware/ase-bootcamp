// backend/server.js  
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
  
app.get('/api/visitors', (req, res) => {  
  db.all("SELECT * FROM visitors", [], (err, rows) => {  
    if (err) {  
      throw err;  
    }  
    res.json(rows);  
  });  
});  
  
app.use('/', express.static(path.join(__dirname, 'public')));  
  
app.listen(3000, () => {  
  console.log('Server is running on port 3000');  
});  
