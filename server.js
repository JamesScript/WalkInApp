// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Modules
const models = require('./backEnd/models');
const routes = require('./backEnd/routes');

// App
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

// Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Routes
routes(app);

// Socket
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('update tables', () => {
    io.emit('update tables');
  });
});

// Listen for Requests
const listener = http.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
