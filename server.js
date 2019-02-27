// Dependencies
const express = require('express');

// Modules
const models = require('./app/models');
const routes = require('./app/routes');

// App
const app = express();
app.use(express.static('public'));

// Homepage
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Routes
routes(app);

// Listen for Requests
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
