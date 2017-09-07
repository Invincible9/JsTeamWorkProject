const mongoose = require('mongoose')
const User = require('../data/User')
const Comment = require('../data/Comments')
const Car = require('../data/Cars')
const Part = require('../data/Parts')

mongoose.Promise = global.Promise


module.exports = (settings) => {
  mongoose.connect(settings.db)

  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log('MongoDB Ready')

    User.seedAdminUser()
  })

  db.on('error', err => console.log(`Database error ${err}`))
}
