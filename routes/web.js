const express = require('express');
const fs = require('fs');
const router = express.Router();

    const homeController = require('../controllers/homeController');
   
    //Route to index file
    router.get('/', homeController().index);
    
    
module.exports = router