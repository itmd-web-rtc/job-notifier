// import express
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const fs = require('fs');
const diffjson = require('diff-json');
const {EventEmitter} = require('events');

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

//Start server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

//Json data change detection logic
var old_file = fs.readFileSync('Data.json', {encoding:"utf8"});
var fileEvent = new EventEmitter();

fileEvent.on('changed file', function(data){
    console.log('The file was changed and fired an event. This data was received:\n' + data);
  });
  
  fs.watch('Data.json', function(eventType, filename) {
    fs.promises.readFile(`${filename}`, {encoding:"utf8"})
      .then(function(data) {
      var new_file = data;
      if(new_file != old_file){
        console.log(`The contents of ${filename} has changed: It was a ${eventType} event.`);
        var file_changes = diffjson.diff(old_file, new_file);
        
        console.log(file_changes);
        
        var all_changes = file_changes.map((change, i) => {
          if(change.added) {
            return `Added: ${change.value}\n`;
          }
          if(change.removed) {
            return `Removed: ${change.value}\n`;
          }
        });
        
       fileEvent.emit('changed file', all_changes.join('\n'));
      }
      old_file = new_file;
    });
    
  });
  