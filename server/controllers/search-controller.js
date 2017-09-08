const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const Part = mongoose.model('Part')

module.exports = {

    searchByKeyword: (req, res) => {
        let keyword = req.body.keyword || 'no results';

        Car
            .find({$text: {$search: keyword}})
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
                
                      }

                Part
                    .find({$text: {$search: keyword}})
                    .then(parts => {

                        let currentUser = '';

                        if(res.locals.currentUser){
                            currentUser = res.locals.currentUser.id
                        }

                        if(currentUser != '' && currentUser != null && currentUser != ' ' && currentUser != undefined && currentUser != "" && currentUser != " "){
                            let rightToChangePost = false

                            for(let part of parts){

                                if(part.author == currentUser){
                                    rightToChangePost = true;
                                    part.rightToChangePost = rightToChangePost
                                }else{
                                    rightToChangePost = false;
                                    part.rightToChangePost = rightToChangePost
                                }
                            }

                        }

                        res.render('search/searchResults', {
                            cars: cars,
                            parts: parts
                        })
                    })

            })
    }
}