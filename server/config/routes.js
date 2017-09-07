const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  // app.use(upload())
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarGet)
  app.post('/createAdCar', auth.isAuthenticated, controllers.cars.createAdCarPost)

  app.get('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartGet)
  app.post('/createAdPart', auth.isAuthenticated, controllers.parts.createAdPartPost)

  app.get('/listAllParts', controllers.parts.listAllPartsGet);

  app.get('/picture', controllers.parts.uploadPictureGet);
  app.post('/picture', controllers.parts.uploadPicturePost);


  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}
