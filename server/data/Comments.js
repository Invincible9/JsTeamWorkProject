const mongoose = require("mongoose");

let commentsSchema = new mongoose.Schema({
    author: {type:String, required:true},
    comment: {type:String, required:true},
    date: {type:Date, default:Date.now},
});

let Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
