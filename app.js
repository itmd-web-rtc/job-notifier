// import express
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const fs = require('fs');
const {EventEmitter} = require('events');
const socketIO = require('socket.io');
const webpush = require('web-push');
const webRouter = require('./routes/web');
const schedule = require('node-schedule');
const subscriptionRouter = require('./routes/subscription');
const scheduleScraping = require('./controllers/scheduleScraping');

require('dotenv').config();

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


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

//import web routes
app.use('/', webRouter);

app.use('/subscription', subscriptionRouter);

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
      newJobList = [];
      JSON.parse(new_file).forEach(element => {
        var index = JSON.parse(old_file).findIndex(x => x.id=== element.id);

        if (index === -1){
          newJobList.push(element);
        }
      });
      
      if(newJobList.length != 0){
        console.log(`The contents of ${filename} has changed: It was a ${eventType} event.`);
        const vapid_keys = {
          public: process.env.VAPID_PUBLIC_KEY,
          private: process.env.VAPID_PRIVATE_KEY
        };

        webpush.setVapidDetails(
          'mailto:dhirajjj75@gmai.com',
          vapid_keys.public,
          vapid_keys.private
        );

        // read subscriptions file; break into an array on newline (NDJSON)
      fs.promises.readFile(`var/subscriptions.json`, {encoding:"utf8"})
      .then(function(subs) {
        let subscriptions = subs.split('\n');
        subscriptions.map(function(subscription) {
          if (subscription.length > 5) {
            subscription = JSON.parse(subscription);
            console.log('Subscription to send to:', subscription);
            webpush.sendNotification(subscription, "There is new Job Posting!!!Checkout")
            .catch(function(error) {
              console.error('sendNotification error: ', error, subscription, "Checkout");
            });
          }
        });
      })
      .catch(function(error) {
        console.error('Error: ', error);
      });
        fileEvent.emit('changed file', newJobList);
      }
      old_file = new_file;
    });
    
  });

  
  var t = schedule.scheduleJob('*/10 * * * *', function(){
    scheduleScraping(); 
 });
 