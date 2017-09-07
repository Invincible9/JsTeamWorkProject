const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const User = mongoose.model('User')

module.exports = {
    createAdCarGET: (req, res) =>{
        res.render('cars/createAdCar')
    },

    createAdCarPOST: (req, res) => {
        let reqBody = req.body

        let carModel = reqBody.model
        let carPrice = reqBody.price
        let carDistanceTravelled = reqBody.distanceTraveled
        let carDateOfManufacture = reqBody.dateOfManufacture
        let carEngine = reqBody.engine
        let carPower = reqBody.power
        let carTransmission = reqBody.transmission
        let carColor = reqBody.color
        let carPicture = reqBody.pictureUrl
        let carLocation = reqBody.location
        let carDescription = reqBody.description
        let adAuthor = res.locals.currentUser.id


        Car
            .create({
                model: carModel,
                price: carPrice,
                distanceTraveled: carDistanceTravelled,
                dateOfManufacture: carDateOfManufacture,
                engine: carEngine,
                power: carPower,
                transmission: carTransmission,
                color: carColor,
                pictureURL: carPicture,
                location: carLocation,
                date: Date.now(),
                author: adAuthor,
                description: carDescription
            })
            .then(carAdvert => {

                User
                .findById(adAuthor)
                .then(author => {
                    author.carAds.push(carAdvert.id)
                    author.save()
                })                
                
                
                
            })
            
            res.redirect('/')

    },

    getCarById: (req, res) => {
        let carId = req.params.id

        Car
            .findById(carId)
            .populate('author')
            .then(car => {
                res.render('cars/carDetail', {
                    car: car
                })
            })
    },

    editCarByIdGET: (req, res) => {
        let carId = req.params.id

        Car
            .findById(carId)
            .then(car => {
                res.render('cars/editCar', {
                    car: car
                })
            })
    },

    editCarByIdPOST: (req, res) => {
        let carId = req.params.id
        let reqBody = req.body
        
        let carModelUpdated = reqBody.model
        let carPriceUpdated = reqBody.price
        let carDistanceTravelledUpdated = reqBody.distanceTraveled
        let carDateOfManufactureUpdated = reqBody.dateOfManufacture
        let carEngineUpdated = reqBody.engine
        let carPowerUpdated = reqBody.power
        let carTransmissionUpdated = reqBody.transmission
        let carColorUpdated = reqBody.color
        let carPictureUpdated = reqBody.pictureUrl
        let carLocationUpdated = reqBody.location
        let carDescriptionUpdated = reqBody.description
        let adAuthorUpdated = res.locals.currentUser.id

        Car
            .findById(carId)
            .then(car => {
                car.model = carModelUpdated,
                car.price = carPriceUpdated,
                car.distanceTraveled = carDistanceTravelledUpdated,
                car.dateOfManufacture = carDateOfManufactureUpdated,
                car.engine = carEngineUpdated,
                car.power = carPowerUpdated,
                car.transmission = carTransmissionUpdated,
                car.color = carColorUpdated,
                car.pictureURL = carPictureUpdated,
                car.location = carLocationUpdated,
                car.date =Date.now(),
                car.author = adAuthorUpdated,
                car.description = carDescriptionUpdated
                car.save()

                res.redirect('/')
            })
    }


}