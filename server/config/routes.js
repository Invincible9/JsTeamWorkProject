const controllers = require('../controllers');
const auth = require('../config/auth');

module.exports = (app) => {
  app.get('/', controllers.home.index);
  app.get('/about', controllers.home.about);

  app.get('/users/register', controllers.users.registerGet);
  app.post('/users/register', controllers.users.registerPost);
  app.get('/users/login', controllers.users.loginGet);
  app.post('/users/login', controllers.users.loginPost);
  app.post('/users/logout', controllers.users.logout);

  app.get('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarGET);
  app.post('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarPOST);

  app.get('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartGET);
  app.post('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartPOST);

  app.get('/listAllParts', controllers.parts.listAllPartsGET);

  app.get('/cars/:id', auth.isAuthenticated, controllers.cars.getCarById );
  app.get('/parts/:id', auth.isAuthenticated, controllers.parts.getPartById);

  app.get('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdGET);
  app.post('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdPOST);

  app.get('/deleteCar/:id', auth.isAuthenticated, controllers.cars.deleteCarByIdGET);
  app.post('/deleteCar/:id', auth.isAuthenticated, controllers.cars.deleteCarByIdPOST);

  app.get('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdGET);
  app.post('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdPOST);

  app.get('/deletePart/:id', auth.isAuthenticated, controllers.parts.deletePartByIdGET);
  app.post('/deletePart/:id', auth.isAuthenticated, controllers.parts.deletePartByIdPOST);

  app.post('/addCarComment/:id', auth.isAuthenticated, controllers.comments.addCommentCarPOST);
  app.post('/addPartComment/:id', auth.isAuthenticated, controllers.comments.addCommentPartPOST);

  app.post('/search', controllers.search.searchByKeyword);

  app.all('*', (req, res) => {
    res.status(404);
    res.send('404 Not found');
    res.end()
  })
};
