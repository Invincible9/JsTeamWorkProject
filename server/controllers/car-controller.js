const mongoose = require('mongoose');
const Car = mongoose.model("Car");
const Part = mongoose.model("Part");

module.exports = {

    createAdCarGet:(req, res) => {
        res.render('cars/createAdCar');
    },

    createAdCarPost:(req, res) => {
        let reqBody = req.body;

        let model = reqBody.model;
        let price = reqBody.price;
        let distanceTraveled = reqBody.distanceTraveled;
        let dateOfManufacture = reqBody.dateOfManufacture;
        let engine = reqBody.engine;
        let power = reqBody.power;
        let transmission = reqBody.transmission;
        let color = reqBody.color;
        let carPictureURL = reqBody.pictureURL;
        let location = reqBody.location;

        Car.create({
            model: model,
            price: price,
            distanceTraveled: distanceTraveled,
            dateOfManufacture: dateOfManufacture,
            engine: engine,
            power: power,
            transmission: transmission,
            color: color,
            pictureURL: carPictureURL,
            location: location,
            date: Date.now()
        }).then(
            res.redirect("/")
        )
    }


}