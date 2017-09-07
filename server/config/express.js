const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('express-handlebars')
const fileUpload = require('express-fileupload')

module.exports = (app) => {
  app.engine('handlebars', handlebars({
    defaultLayout: 'main'
  }))
  app.set('view engine', 'handlebars')

  app.use(cookieParser())
  
  app.use(bodyParser.urlencoded({ extended: true }))
  
  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: false,
    saveUninitialized: false
  }))
  
  app.use(passport.initialize())
  
  app.use(passport.session())

  // Use express-fileUpload to handle multipart data
  app.use(fileUpload());
  
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
      res.locals.isAdmin = req.user.roles.indexOf('Admin') >= 0
      // console.log(req.user._doc.firstName)
      // console.log(req.user.firstName)
      // console.log('debug')
    }

    next()
  })

  app.use(express.static(path.join(__dirname + '/../../', 'public')));

  console.log('Express ready!')
}
