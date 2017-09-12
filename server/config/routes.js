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
  app.get('/cars/:id', auth.isAuthenticated, controllers.cars.getCarById);

  app.get('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarGET);
  app.post('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarPOST);

  app.get('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdGET);
  app.post('/editCar/:id', auth.isAuthenticated, controllers.cars.editCarByIdPOST);

  app.get('/deleteCar/:id', auth.isAuthenticated, controllers.cars.deleteCarByIdGET);

  // Parts routes
  app.get('/parts/:id', auth.isAuthenticated, controllers.parts.getPartById);

  app.get('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartGET);
  app.post('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartPOST);
  
  app.get('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdGET);
  app.post('/editPart/:id', auth.isAuthenticated, controllers.parts.editPartByIdPOST);

  app.get('/deletePart/:id', auth.isAuthenticated, controllers.parts.deletePartByIdGET);

  app.get('/listAllParts', controllers.parts.listAllPartsGET);
  
  // Comments routes
  app.post('/addCarComment/:id', auth.isAuthenticated, controllers.comments.addCommentCarPOST);
  app.post('/addPartComment/:id', auth.isAuthenticated, controllers.comments.addCommentPartPOST);

  // Search route
  app.post('/search', controllers.search.searchByKeyword);

  // Likes routes
  app.get('/likeCar/:id', auth.isAuthenticated, controllers.cars.addLikeCarPOST);
  app.get('/likePart/:id', auth.isAuthenticated, controllers.parts.addLikePartPOST);

  //User profile routes
  app.get('/users/profile/:id', auth.isAuthenticated, controllers.users.getUserProfile);
  app.get('/users/settings/:id', auth.isAuthenticated, controllers.users.userSettingsGet);
  app.post('/users/uploadProfilePicture/:id', auth.isAuthenticated, controllers.users.userUploadProfilePic);
  app.get('/users/deleteProfile/:id', auth.isAuthenticated, controllers.users.removeUserAccountById);

  // Delete And Edit Comments Routes - Car
  app.get('/deleteCarCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.deleteCarCommentByAuthorGET);
  app.get('/editCarCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.editCarCommentByAuthorGET);
  app.post('/editCarCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.editCarCommentByAuthorPOST);

  // Delete And Edit Comments Routes - Part
  app.get('/deletePartCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.deletePartCommentByAuthorGET);
  app.get('/editPartCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.editPartCommentByAuthorGET);
  app.post('/editPartCommentByAuthor/:id', auth.isAuthenticated, controllers.comments.editPartCommentByAuthorPOST);

  // Message Routes
  app.get('/mailBox', auth.isAuthenticated, controllers.message.mailBoxGET);
  app.get('/messageDetail/:id', auth.isAuthenticated, controllers.message.messageDetailGET);
  app.post('/sendMessageToSender/:id', auth.isAuthenticated, controllers.message.sendMessageToSenderPOST);
  app.post('/messageCar/:id', auth.isAuthenticated, controllers.message.messageCarPOST);
  app.post('/messagePart/:id', auth.isAuthenticated, controllers.message.messagePartPOST);
  app.get('/deleteMessage/:id', auth.isAuthenticated, controllers.message.deleteMessageGET);




    // Error handling invalid rrl
  app.use((req, res) => {
    res.status(404);
    res.render('home/error');
  });

  // Error handling invalid url with params: example ':id'
  app.use((err, req, res, next) => {
    res.status(404);
    res.render('home/error');
  });
};
