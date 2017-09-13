const mongoose = require('mongoose');
const Car = mongoose.model('Car');
const User = mongoose.model('User')
const Message = mongoose.model('Message')

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
            rightToChangePost = true;
            car.rightToChangePost = rightToChangePost
          }else{
            rightToChangePost = false;
            car.rightToChangePost = rightToChangePost
          }
        }

        User
          .findById(res.locals.currentUser.id)
          .then(user => {
              Message
                .find({'recipient': res.locals.currentUser.id})
                .then(allReceivedMessages => {
                    res.render('home/index', {
                      cars: cars,
                      user: user,
                      messages: allReceivedMessages,
                      hasMails: allReceivedMessages.length > 0
                    })
  
                })
  
          })
      }else{

        res.render('home/index', {
            cars: cars
        })
      }



    })  

  },

  about: (req, res) => {
    res.render('home/about')
  }
}
