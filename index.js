// app.js
const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (like our JavaScript) from the 'public' folder
app.use(express.static('public'));

// Route to serve the main drawing page
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});