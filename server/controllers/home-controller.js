const mongoose = require('mongoose')
const Car = mongoose.model('Car')

module.exports = {
  index: (req, res) => {

  Car
    .find({})
    .then(cars => {
      res.render('home/index', {
        cars: cars
      })

    })  


  },

  about: (req, res) => {
    res.render('home/about')
  }
}
