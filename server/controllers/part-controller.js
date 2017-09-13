const mongoose = require('mongoose');
const Part = mongoose.model('Part');
const User = mongoose.model('User');
const Message = mongoose.model('Message');
const fs = require('fs');

module.exports = {
    createAdPartGET: (req, res) => {
        res.render('parts/createAdPart')
    },

    createAdPartPOST: (req, res) => {
        let reqBody = req.body;
        let partName = reqBody.name;
        let partPrice = reqBody.price;
        let partCondition = reqBody.condition;
        let partAvailability = reqBody.availability;
        let partLocation = reqBody.location;
        let partDescription = reqBody.description;
        let partAuthor = res.locals.currentUser.id;

        Part
            .create({
                name: partName,
                price: partPrice,
                condition: partCondition,
                availability: partAvailability,
                date: Date.now(),
                location: partLocation,
                author: partAuthor,
                description: partDescription,
                views: 0
            })
            .then(partAdvert => {
                let partImagePath = `./public/images/partPictures/${partAdvert.id}`;
                let picture = req.files.pictureURL;

                Part.findByIdAndUpdate(partAdvert.id, {$set: {pictureURL: partImagePath}}).then(() => {
                    // console.log(picture);
                    // console.log(partImagePath)
                    picture.mv(partImagePath, err => {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                    User.findById(partAuthor).then(author => {
                        author.partAds.push(partAdvert.id);
                        author.save()
                    });
                });
            });

        res.redirect('/listAllParts')
    },

    listAllPartsGET: (req, res) => {
        Part
            .find({})
            .then(parts => {

                let currentUser = '';

                if (res.locals.currentUser) {
                    currentUser = res.locals.currentUser.id
                }

                if (currentUser != '' && currentUser != null && currentUser != ' ' && currentUser != undefined && currentUser != "" && currentUser != " ") {
                    let rightToChangePost = false;


                    for (let part of parts) {

                        if (part.author == currentUser) {
                            rightToChangePost = true;
                            part.rightToChangePost = rightToChangePost
                        } else {
                            rightToChangePost = false;
                            part.rightToChangePost = rightToChangePost
                        }
                    }


                    User
                    .findById(res.locals.currentUser.id)
                    .then(user => {
                        Message
                          .find({'recipient': res.locals.currentUser.id})
                          .then(allReceivedMessages => {
                              res.render('parts/listAllParts', {
                                parts: parts,
                                user: user,
                                messages: allReceivedMessages,
                                hasMails: allReceivedMessages.length > 0
                              })
            
                          })
            
                    })


                }else{

                    res.render('parts/listAllParts', {
                        parts: parts
                    })
                }

            })
    },

    getPartById: (req, res, next) => {
        let partId = req.params.id;
        let authorId = res.locals.currentUser.id;

        Part.findById(partId)
            .populate('author')
            .populate('comments')
            .then(part => {

                let voteUp = true;
                let rightToEditPost = false
                let isNotAuthorOfAd = true

                for(let comment of part.comments){
                  
                    if(comment.author == authorId){
                        rightToEditPost = true

                        comment.rightToEditPost = rightToEditPost
                        // break
                    }else{

                        rightToEditPost = false
                        comment.rightToEditPost = rightToEditPost
                    }



                }

                for (let id of part.likes) {
                    if (id == authorId) {
                        voteUp = false;
                        break;
                    }
                }

                part.rightToVoteUp = voteUp;

                if(part.author.username != res.locals.currentUser.username){
                    isNotAuthorOfAd = true
                }else{
                    isNotAuthorOfAd = false
                }
                
                part.isNotAuthorOfAd = isNotAuthorOfAd

                let countView = part.views;
                part.views = ++countView;
                part.save();


                User
                    .findById(authorId)
                    .then(user => {

                        Message
                            .find({'recipient': authorId})
                            .then(allReceivedMessages => {
                                res.render('parts/partDetail', {
                                    part:part,
                                    user: user,
                                    messages: allReceivedMessages,
                                    hasMails: allReceivedMessages.length > 0
                                })

                            })

                    })


            }).catch(next)
    },

    editPartByIdGET: (req, res, next) => {
        let partId = req.params.id;

        Part.findById(partId).then(part => {
            res.render('parts/editPart', {part: part})
        }).catch(next);
    },

    editPartByIdPOST: (req, res) => {
        let partId = req.params.id;
        let body = req.body;

        let picture = req.files.pictureURL;

        let partPictureUpdated;
        if (picture) {
            let partImagePath = `./public/images/PartPictures/${partId}`;
            picture.mv(partImagePath, err => {
                if (err) {
                    console.log(err.message);
                }
                partPictureUpdated = partImagePath;
            });
        }

        let partName = body.name;
        let partPrice = body.price;
        let partCondition = body.condition;
        let partAvailability = body.availability;
        let partLocation = body.location;
        let partAuthor = res.locals.currentUser.id;
        let partDescription = body.description;

        Part.findById(partId).then(part => {
            part.name = partName,
            part.price = partPrice,
            part.condition = partCondition,
            part.availability = partAvailability,
            part.pictureURL = partPictureUpdated || part.pictureURL,
            part.location = partLocation,
            part.author = partAuthor,
            part.description = partDescription

            part.save();
            res.redirect('/listAllParts');
        })

    },

    deletePartByIdGET: (req, res) => {

        let partId = req.params.id;

        Part.findByIdAndRemove(partId).then(part => {
            let author = part.author;

            if (part.pictureURL != undefined) {
                let partImagePath = `./public/images/partPictures/${partId}`;

                fs.unlinkSync(partImagePath, err => {
                    if (err) {
                        console.log(err.message);
                    }
                });
            }

            User.findById(author).then(author => {
                let index = author.partAds.indexOf(partId);
                author.partAds.splice(index, 1);
                author.save();

                res.redirect('/listAllParts')
            });
        });
    },

    addLikePartPOST: (req, res) => {
        let partId = req.params.id;
        let authorId = res.locals.currentUser.id;

        Part.findById(partId)
            .then(part => {

                let voteUp = true;

                for(let id of part.likes){
                    if(id == authorId){
                        voteUp = false;
                        break;
                    }
                }

                part.rightToVoteUp = voteUp;

                if(voteUp) {
                    part.likes.push(authorId);
                    part.save();
                }
            });

        res.redirect(`/parts/${partId}`);
    },



};
