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
    },

    // CAR Routes - Edit and Delete
    deleteCarCommentByAuthorGET: (req, res) => {
        let commentId = req.params.id;
        let carID = req.headers.referer.substring(req.headers.referer.lastIndexOf('/') + 1);

        Comment.findByIdAndRemove(commentId).then(
            Car.findById(carID).then(car => {
                let index = car.comments.indexOf(commentId);
                car.comments.splice(index, 1);
                car.save();

                res.redirect(`/cars/${carID}`);
            }));
    },

    editCarCommentByAuthorGET: (req, res) => {
        let commentId = req.params.id;
        let carID = req.headers.referer.substring(req.headers.referer.lastIndexOf('/') + 1);

        Comment
            .findById(commentId)
            .then(comment => {
                res.render('comments/editCommentCar',
                    {
                        comment: comment,
                        carID: carID
                    });
            })
    },

    editCarCommentByAuthorPOST: (req, res) => {

        let commentID = req.params.id;
        let body = req.body;

        let newComment = body.comment;
        let carID = body.carID;

        Comment.findById(commentID).then(comment => {
            comment.comment = newComment;
            comment.save();


            res.redirect(`/cars/${carID}`);
        });
    },


    //// Part Routes EDIT and Delete - Parts

    deletePartCommentByAuthorGET: (req, res) => {
        let commentId = req.params.id;
        let partID = req.headers.referer.substring(req.headers.referer.lastIndexOf('/') + 1);

        Comment.findByIdAndRemove(commentId).then(

            Part.findById(partID).then(part => {
                let index = part.comments.indexOf(commentId);
                part.comments.splice(index, 1);
                part.save();

                res.redirect(`/parts/${partID}`);
            }));
    },

    editPartCommentByAuthorGET: (req, res) => {
        let commentId = req.params.id;
        let partID = req.headers.referer.substring(req.headers.referer.lastIndexOf('/') + 1);

        Comment
            .findById(commentId)
            .then(comment => {
                res.render('comments/editCommentPart',
                    {
                        comment: comment,
                        partID: partID
                    });
            })
    },

    editPartCommentByAuthorPOST: (req, res) => {

        let commentID = req.params.id;
        let body = req.body;

        let newComment = body.comment;
        let partID = body.partID;

        Comment.findById(commentID).then(comment => {
            comment.comment = newComment;
            comment.save();


            res.redirect(`/parts/${partID}`);
        });

    }






};