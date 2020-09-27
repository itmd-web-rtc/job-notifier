// import express
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

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