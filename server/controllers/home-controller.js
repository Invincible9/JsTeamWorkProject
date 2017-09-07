const mongoose = require('mongoose')
const Car = mongoose.model('Car')

module.exports = {
  index: (req, res) => {

  Car
    .find({})
    .then(cars => {

     let currentUser = '';

      if(res.locals.currentUser){
         currentUser = res.locals.currentUser.id
      }

      if(currentUser != '' && currentUser != null && currentUser != ' ' && currentUser != undefined && currentUser != "" && currentUser != " "){
        let rightToChangePost = false
      
  
        for(let car of cars){

          if(car.author == currentUser){
            rightToChangePost = true
            car.rightToChangePost = rightToChangePost
          }else{
            rightToChangePost = false
            car.rightToChangePost = rightToChangePost
          }
        }

      }

      res.render('home/index', {
        cars: cars
      })

    })  

  },

  about: (req, res) => {
    res.render('home/about')
  }
}
