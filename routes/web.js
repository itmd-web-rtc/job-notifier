function initRoutes(app){

    const homeController = require('../controllers/homeController');
   
    //Route to index file
    app.get('/', homeController().index);
    
    }
    
module.exports = initRoutes