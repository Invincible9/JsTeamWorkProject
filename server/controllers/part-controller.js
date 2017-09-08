const mongoose = require('mongoose');
const Part = mongoose.model('Part');
const User = mongoose.model('User');
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

                }


                res.render('parts/listAllParts', {
                    parts: parts
                })
            })
    },

    getPartById: (req, res) => {
        let partId = req.params.id;

        Part
            .findById(partId)
            .populate('author')
            .populate('comments')
            .then(part => {

                let countView = part.views;
                part.views = ++countView;
                part.save();

                res.render('parts/partDetail', {
                    part:part
                })
            })
    },

    editPartByIdGET: (req, res) => {
        let partId = req.params.id;

        Part.findById(partId).then(part => {
            res.render('parts/editPart', {part: part})
        })
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

        Part.findById(partId).then(part => {
            res.render("parts/deletePart", {part: part});
        })
    },

    deletePartByIdPOST: (req, res) => {
        let partId = req.params.id;

        Part.findByIdAndRemove(partId)
            .then(part => {
                let author = part.author;

                let partImagePath = `./public/images/partPictures/${partId}`;

                fs.unlinkSync(partImagePath, err => {
                    if (err) {
                        console.log(err.message);
                    }
                });

                User.findById(author).then(author => {
                    let index = author.partAds.indexOf(partId);
                    author.partAds.splice(index, 1);
                    author.save();

                    res.redirect('/listAllParts')
                });
            });
    },

    addLikePartPOST: (req, res) => {

    }

};
