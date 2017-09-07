const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');
const Car = mongoose.model('Car');
const Part = mongoose.model('Part');

module.exports = {

    addCommentCarPOST: (req, res) => {

        let carId = req.params.id;
        let body = req.body;
        let commentAuthor = res.locals.currentUser.id;
        let commentAuthorName = res.locals.currentUser.username;

        let userComment = body.comment;

        Comment.create({
            author: commentAuthor,
            comment: userComment,
            name: commentAuthorName,
            date: Date.now()
        }).then(comment => {

                User.findById(commentAuthor).then(author => {
                    author.comments.push(comment.id);
                    author.save();
                });

                Car.findById(carId).then(car => {
                    car.comments.push(comment.id);
                    car.save()
                });

                res.redirect(`/cars/${carId}`)
            }
        )
    },

    addCommentPartPOST: (req, res) => {
        let partId = req.params.id;
        let body = req.body;
        let commentAuthor = res.locals.currentUser.id;
        let commentAuthorName = res.locals.currentUser.username;

        let userComment = body.comment;

        Comment.create({
            author: commentAuthor,
            comment: userComment,
            name: commentAuthorName,
            date: Date.now()
        }).then(comment => {

                User.findById(commentAuthor).then(author => {
                    author.comments.push(comment.id);
                    author.save();
                });

                Part.findById(partId).then(part => {
                    part.comments.push(comment.id);
                    part.save();
                });

                res.redirect(`/parts/${partId}`)
            }
        )
    }


};