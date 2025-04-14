// test.js
const express = require('express');
const app = express();

// Ensure the body parser is used before the route definitions
app.use(express.urlencoded({ extended: false }));

// Minimal GET route for testing purposes
app.get('/organiser/add-course', (req, res) => {
  res.send("GET route is working");
});

// Minimal POST route for testing purposes
app.post('/organiser/add-course', (req, res) => {
  console.log("POST /organiser/add-course hit");
  res.send("POST route works");
});

// Log every request to see what comes in
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server started on port ${PORT}`);
});
