const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

let commentsSchema = new mongoose.Schema({
    author: { type: ObjectId, required: true},
    comment: { type: String, required: true},
    date: { type: Date, default: Date.now}
})

let Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;