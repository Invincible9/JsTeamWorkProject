const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const User = mongoose.model('User')
const fs = require('fs');

module.exports = {
    createAdCarGET: (req, res) => {
        res.render('cars/createAdCar')
    },

    createAdCarPOST: (req, res) => {
        let reqBody = req.body;

        let carModel = reqBody.model;
        let carPrice = reqBody.price;
        let carDistanceTravelled = reqBody.distanceTraveled;
        let carDateOfManufacture = reqBody.dateOfManufacture;
        let carEngine = reqBody.engine;
        let carPower = reqBody.power;
        let carTransmission = reqBody.transmission;
        let carColor = reqBody.color;
        let carLocation = reqBody.location;
        let carDescription = reqBody.description;
        let adAuthor = res.locals.currentUser.id;

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
                location: carLocation,
                date: Date.now(),
                author: adAuthor,
                description: carDescription,
                views: 0
            })
            .then(carAdvert => {
                let carImagePath = `./public/images/CarPictures/${carAdvert.id}`;
                let picture = req.files.pictureUrl;

                Car.findByIdAndUpdate(carAdvert.id, {$set: {pictureURL: carImagePath}}).then(() => {
                    picture.mv(carImagePath, err => {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                    User.findById(adAuthor).then(author => {
                        author.carAds.push(carAdvert.id);
                        author.save()
                    });
                });

            });

        res.redirect('/')
    },

    getCarById: (req, res, next) => {
        let carId = req.params.id;
        let authorId = res.locals.currentUser.id;

        Car.findById(carId)
            .populate('comments')
            .populate('author')
            .then(car => {

                let voteUp = true;

                for (let id of car.likes) {
                    if (id == authorId) {
                        voteUp = false;
                        break;
                    }
                }

                car.rightToVoteUp = voteUp;

                let countView = car.views;
                car.views = ++countView;
                car.save();

                res.render('cars/carDetail',
                    {
                        car: car

                    });
            }).catch(next);
    },

    editCarByIdGET: (req, res, next) => {
        let carId = req.params.id;

        Car.findById(carId).then(car => {
                res.render('cars/editCar', {car: car})
        })
        .catch(next);
    },

    editCarByIdPOST: (req, res) => {
        let carId = req.params.id
        let reqBody = req.body

        let picture = req.files.pictureUrl;

        let carPictureUpdated;
        if (picture) {
            let carImagePath = `./public/images/CarPictures/${carId}`;
            picture.mv(carImagePath, err => {
                if (err) {
                    console.log(err.message);
                }
                carPictureUpdated = carImagePath;
            });
        }

        let carModelUpdated = reqBody.model;
        let carPriceUpdated = reqBody.price;
        let carDistanceTravelledUpdated = reqBody.distanceTraveled;
        let carDateOfManufactureUpdated = reqBody.dateOfManufacture;
        let carEngineUpdated = reqBody.engine;
        let carPowerUpdated = reqBody.power;
        let carTransmissionUpdated = reqBody.transmission;
        let carColorUpdated = reqBody.color;
        let carLocationUpdated = reqBody.location;
        let carDescriptionUpdated = reqBody.description;
        let adAuthorUpdated = res.locals.currentUser.id;

        Car.findById(carId).then(car => {
            car.model = carModelUpdated,
            car.price = carPriceUpdated,
            car.distanceTraveled = carDistanceTravelledUpdated,
            car.dateOfManufacture = carDateOfManufactureUpdated,
            car.engine = carEngineUpdated,
            car.power = carPowerUpdated,
            car.transmission = carTransmissionUpdated,
            car.color = carColorUpdated,
            car.pictureURL = carPictureUpdated || car.pictureURL,
            car.location = carLocationUpdated,
            car.date = Date.now();
            car.author = adAuthorUpdated,
            car.description = carDescriptionUpdated

            car.save()

            res.redirect('/')
        });
    },

    deleteCarByIdPOST: (req, res) => {
        let carId = req.params.id;

        Car.findByIdAndRemove(carId).then(car => {
            let author = car.author;

            if (car.pictureUrl != undefined) {
                let carImagePath = `./public/images/CarPictures/${carId}`;

                fs.unlinkSync(carImagePath, err => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            }

            User.findById(author).then(author => {
                let index = author.carAds.indexOf(carId);
                author.carAds.splice(index, 1);
                author.save();

                res.redirect('/')
            });
        });
    },

    addLikeCarPOST: (req, res) => {
        let carId = req.params.id;
        let authorId = res.locals.currentUser.id;

        Car.findById(carId)
            .then(car => {

                let voteUp = true;

                for (let id of car.likes) {
                    if (id == authorId) {
                        voteUp = false;
                        break;
                    }
                }

                car.rightToVoteUp = voteUp;

                if (voteUp) {
                    car.likes.push(authorId);
                    car.save();
                }
            });

        res.redirect(`/cars/${carId}`);

    }

};