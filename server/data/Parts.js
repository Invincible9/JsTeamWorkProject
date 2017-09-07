const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let partSchema = new mongoose.Schema({
     name:{type:String},
     price:{type:Number},
     condition:{type:String},
     availability: {type:String},
     location:{type:String},
     pictureURL:{type:String},
     comments:{type:ObjectId, ref:'Comment'},
     date:{type:Date, default:Date.now}
});

let Part = mongoose.model("Part", partSchema);

module.exports = Part;

