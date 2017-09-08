const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let carSchema = new mongoose.Schema({
    model: {type: String},
    price: {type: Number},
    distanceTraveled: {type: Number},
    dateOfManufacture: {type: String},
    engine: {type: String},
    power: {type: String},
    transmission: {type: String},
    color: {type: String},
    pictureURL: {type: String},
    location: {type: String},
    date: {type: Date, default: Date.now},
    comments: [{type: ObjectId, ref: 'Comment'}],
    author: {type: ObjectId, ref: 'User'},
    description: {type: String},
    views: {type: Number},
    likes: [{type: ObjectId, ref: 'User'}]
});

carSchema.index({'$**': 'text'});

let Car = mongoose.model('Car', carSchema);

module.exports = Car;