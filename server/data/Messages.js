const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let messageSchema = new mongoose.Schema({
    sender: {type: ObjectId, ref: 'User'},
    recipient: {type: ObjectId, ref: 'User'},
    message: {type: String},
    date: {type: Date, default: Date.now},
    isReaded: {type: Boolean}
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;
