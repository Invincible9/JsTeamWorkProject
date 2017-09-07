const mongoose = require('mongoose');
const Part = mongoose.model('Part');
const upload = require('express-fileupload');
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

let server = express();

server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());
server.use(upload());

module.exports = {

    uploadPictureGet:(req, res) => {
        res.render("pictures/picture");
        // res.sendFile(__dirname + "/picture.handlebars");
        console.log(res);
    },

    uploadPicturePost:(req,res) => {
        if(req.files){
            console.log(req.files);
        }
    },


    listAllPartsGet:(req, res) =>{
        Part.find({}).then(parts => {
            res.render("parts/listAllParts", {parts:parts})
        })
    },

    createAdPartGet:(req, res) => {
        res.render('parts/createAdPart');
    },

    createAdPartPost:(req, res) => {
        let reqBody = req.body;

        let partName = reqBody.name;
        let partPrice = reqBody.price;
        let partCondition = reqBody.condition;
        let partAvailability = reqBody.availability;
        let partPictureURL = reqBody.pictureURL;
        let partLocation = reqBody.location;

        Part.create({
            name: partName,
            price: partPrice,
            condition: partCondition,
            availability: partAvailability,
            pictureURL: partPictureURL,
            location: partLocation,
            date: Date.now()
        }).then(
            res.redirect('/')
        )
    }

}