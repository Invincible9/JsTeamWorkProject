const controllers = require('../controllers');
const auth = require('../config/auth');

module.exports = (app) => {
  app.get('/', controllers.home.index);
  app.get('/about', controllers.home.about);

  // User routes
  app.get('/users/register', controllers.users.registerGet);
  app.post('/users/register', controllers.users.registerPost);
  app.get('/users/login', controllers.users.loginGet);
  app.post('/users/login', controllers.users.loginPost);
  app.post('/users/logout', controllers.users.logout);

  // Cars routes
  app.get('/cars/:id', auth.isAuthenticated, controllers.cars.getCarById );

  app.get('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarGET);
  app.post('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarPOST);

  app.get('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdGET);
  app.post('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdPOST);

  app.post('/deleteCar/:id', auth.isAuthenticated, controllers.cars.deleteCarByIdPOST);

  // Parts routes
  app.get('/parts/:id', auth.isAuthenticated, controllers.parts.getPartById);

  app.get('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartGET);
  app.post('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartPOST);
  
  app.get('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdGET);
  app.post('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdPOST);

  app.post('/deletePart/:id', auth.isAuthenticated, controllers.parts.deletePartByIdPOST);

  app.get('/listAllParts', controllers.parts.listAllPartsGET);
  
  // Comments routes
  app.post('/addCarComment/:id', auth.isAuthenticated, controllers.comments.addCommentCarPOST);
  app.post('/addPartComment/:id', auth.isAuthenticated, controllers.comments.addCommentPartPOST);

  app.post('/search', controllers.search.searchByKeyword);

  app.all('*', (req, res) => {
    res.status(404);
    res.send('404 Not found');
    res.end()
  })
};
