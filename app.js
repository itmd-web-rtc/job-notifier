// import express
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const fs = require('fs');
const diffjson = require('diff');
const {EventEmitter} = require('events');
const socketIO = require('socket.io');

//get path
const path = require('path');

// Initialize express
const app = express();

//Get port from environment variable
const PORT = process.env.PORT || 3000;

//Assets
app.use(express.static('public'));

//Set template engine
app.use(expressLayout);

//set views path
app.set('views', path.join(__dirname,'/resources/views'));

//set app engine - ejs
app.set('view engine', 'ejs');

//import web routes
require('./routes/web')(app)

const http = require('http')

let server = http.createServer(app) 

let io = socketIO(server) 

//Start server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
}); 

//Json data change detection logic
var old_file = fs.readFileSync('Data.json', {encoding:"utf8"});
var fileEvent = new EventEmitter();


// send a message on successful socket connection
// make connection with user from server side 
io.on('connection', (socket)=>{ 
  console.log('New user connected'); 

  fileEvent.on('changed file', function(data){
    socket.emit('diffed changes', data);
  });
});



  
  fs.watch('Data.json', function(eventType, filename) {
    fs.promises.readFile(`${filename}`, {encoding:"utf8"})
      .then(function(data) {
      var new_file = data;
      if(new_file != old_file){
        console.log(`The contents of ${filename} has changed: It was a ${eventType} event.`);
        var file_changes = diffjson.diffArrays(old_file, new_file);
        fileEvent.emit('changed file', new_file);
      }
      old_file = new_file;
    });
    
  });