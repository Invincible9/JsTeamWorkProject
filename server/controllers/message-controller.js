const mongoose = require('mongoose');
const Message = mongoose.model('Message');

module.exports = {

    mailBoxGET: (req, res) => {

        Message.find({'recipient': res.locals.currentUser.id})
            .populate('sender')
            .then(mails => {
                // console.log(mails);
                res.render('messages/mailBox',
                    {
                        mails: mails
                    });
            });

    },

    messageDetailGET: (req, res) => {
        let id = req.params.id;

        Message.findById(id).then(message => {
            res.render('messages/messageDetail',
                {
                    message: message
                })
        })
    },

    sendMessageToSenderPOST: (req, res) => {
        let senderId = res.locals.currentUser.id;
        let recipientId = req.params.id;
        let body = req.body;

        let userMessage = body.message;
        let messageID = body.messageID;

        Message.create({
            sender: senderId,
            recipient: recipientId,
            message: userMessage,
            date: Date.now(),
        }).then(
            res.redirect(`/messageDetail/${messageID}`)
        )
    },

    deleteMessageGET: (req, res) => {
        let messageId = req.params.id;

        Message.findByIdAndRemove(messageId).then(
            res.redirect('/mailBox')
        )
    },

    messageCarPOST: (req, res) => {
        let senderMessage = res.locals.currentUser.id;
        let recipientMessage = req.params.id;
        let body = req.body;

        let userMessage = body.message;
        let carID = body.carID;

        Message.create({
            sender: senderMessage,
            recipient: recipientMessage,
            message: userMessage,
            date: Date.now(),
        }).then(
            res.redirect(`/cars/${carID}`)
        )
    },

    messagePartPOST:(req, res) => {
        let senderMessage = res.locals.currentUser.id;
        let recipientMessage = req.params.id;
        let body = req.body;

        let userMessage = body.message;
        let partID = body.partID;

        Message.create({
            sender: senderMessage,
            recipient: recipientMessage,
            message: userMessage,
            date: Date.now(),
        }).then(
            res.redirect(`/parts/${partID}`)
        )
    }


};
