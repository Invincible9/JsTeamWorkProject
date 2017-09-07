const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

module.exports = {
    addCommentPOST: (req, res) => {

        let carId = req.params.id;
        let body = req.body;
        let commentAuthor = res.locals.currentUser.id;

        let userComment = body.comment;

        Comment.create({
            author: commentAuthor,
            comment: userComment,
            date: Date.now()
        }).then(comment => {
                User.findById(commentAuthor).then(author => {
                    author.comments.push(comment.id);
                    author.save();
                    res.redirect(`/cars/${carId}`)
                })
            }
        )
    }


};