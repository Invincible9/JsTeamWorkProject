const mongoose = require('mongoose');
const User = require('../data/User');
const Comment = require('../data/Comments');
const Car = require('../data/Cars');
const Part = require('../data/Parts');
const Message = require('../data/Messages');

mongoose.Promise = global.Promise;


module.exports = (settings) => {
  mongoose.connect(settings.db);

  let db = mongoose.connection;

  db.once('open', err => {
    if (err) {
      throw err
    }

    User.seedAdminUser()
  })

  db.on('error', err => console.log(`Database error ${err}`))
}
