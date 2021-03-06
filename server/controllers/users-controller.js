const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const Car = require('mongoose').model('Car')
const Part = require('mongoose').model('Part')
const Comment = require('mongoose').model('Comment')
const Message = require('mongoose').model('Message')
const errorHandler = require('../utilities/error-handler')
const fs = require('fs')

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register')
    },

    registerPost: (req, res) => {
        let reqUser = req.body;

        let errorMessages = [];
        User.findOne({username: reqUser.username}).then(user => {

            if (user) {
                console.log(user)
                errorMessages.push('Username is already taken');
            }
            if (reqUser.username.length < 5) {
                errorMessages.push("Username needs to be atleast 5 characters");
            }
            if (reqUser.password.length < 6) {
                errorMessages.push("Password is too weak");
            }

            if(reqUser.password != reqUser.confirmPassword){
                errorMessages.push("Password did not match");
            }

            if (errorMessages.length > 0) {
                reqUser.errorMessages = errorMessages;
                res.render('users/register', reqUser);
            } else {
                let salt = encryption.generateSalt();
                let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password);

                let userObject = {
                    username: reqUser.username,
                    firstName: reqUser.firstName,
                    lastName: reqUser.lastName,
                    salt: salt,
                    hashedPass: hashedPassword,
                    roles: ['User'],
                    isActive: true,
                    email: reqUser.email
                };

                User.create(userObject).then(user => {
                    req.logIn(user, (err, user) => {
                        if (err) {
                            errorMessages.push(err);
                            user.errorMessage = errorMessages;

                            res.render('users/register', user)
                        }

                        res.redirect('/')
                    });
                });
            }
        });
    },

    loginGet: (req, res) => {
        res.render('users/login')
    },

    loginPost: (req, res) => {
        let reqUser = req.body

        User.findOne({username: reqUser.username}).then(user => {
            if (!user || !user.authenticate(reqUser.password)) {
                let errorMessage = 'Invalid user data';
                res.render('users/login', {errorMessage: errorMessage});
                return;
            }

            if (user.isActive === false) {
                let errorMessage = 'You have banned to use this site for 1 day';
                res.render('users/login', {errorMessage: errorMessage});
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    let errorMessage = err;
                    res.render('users/login', {errorMessage: errorMessage});
                }

                res.redirect('/');
            });
        });
    },

    logout: (req, res) => {
        req.logout()
        res.redirect('/')
    },

    getUserProfile: (req, res, next) => {

        let userId = req.params.id

        User.findById(userId)
            .populate('carAds')
            .populate('partAds')
            .populate('comments')
            .then(user => {

                Message
                    .find({'recipient': userId, 'isReaded': false})
                    .then(allReceivedMessages => {
                        res.render('users/profile', {
                            user: user,
                            messages: allReceivedMessages,
                            hasMails: allReceivedMessages.length > 0

                    })
                })        

            }).catch(next);
        // let userName = req.params.username
        // let id = req.user.id
        // let pageSize = 2
        // let page = parseInt(req.query.page) || 1


        // User
        //       .findById(id)
        //       .then(user => {
        //         Thread
        //                     .find({'author': id})
        //                     .sort({'date': -1})
        //                     .populate('answers')
        //                     .skip((page - 1) * pageSize)
        //                     .limit(pageSize)
        //                     // .populate('answers')
        //                     .then(thread => {
        //                       // console.log(thread)
        //                       res.render('users/profil', {
        //                         thread: thread,
        //                         user: user,
        //                         hasPrev: page > 1,
        //                         hasNext: thread.length > 0,
        //                         nextPage: page + 1,
        //                         prevPage: page - 1
        //                       })
        //                     })
        //       })
        //       .catch(err => {
        //         let errMessage = errorHandler.handleMongooseError(err)
        //         console.log(errMessage)
        //       })

        // User
        //       .find({'username': userName})
        //       .then(user => {
        //         res.render('users/profil', {
        //           user: user
        //         })
        //       })
        //       .catch(err => {
        //         let errMessage = errorHandler.handleMongooseError(err)
        //         console.log(errMessage)
        //       })
    },

    userSettingsGet: (req, res) => {
        let userId = req.params.id

        User
            .findById(userId)
            .then(user => {
                Message
                    .find({'recipient': userId})
                    .then(allReceivedMessages => {
                        res.render('users/settings', {
                            user: user,
                            messages: allReceivedMessages,
                            hasMails: allReceivedMessages.length > 0
                        })

                    })

            })
    },

    userUploadProfilePic: (req, res) => {
        let userId = req.params.id;

        User
            .findById(userId)
            .then(user => {
                let profileImagePath = `./public/images/UsersProfilesPictures/${userId}`;
                let picture = req.files.profilePictureURL

                user.profilePicture = profileImagePath
                picture.mv(profileImagePath, err => {
                    if (err) {
                        console.log(err.message);
                    }

                    user.save()

                    res.redirect(`/users/profile/${userId}`)

                })
            })
    },


    removeUserAccountById: (req, res) => {
        let userId = req.params.id

        User
            .findByIdAndRemove(userId)
            .then(user => {

                let userProfileImagePath = `./public/images/UsersProfilesPictures/${userId}`;

                fs.unlinkSync(userProfileImagePath, err => {
                    if (err) {
                        console.log(err.message);
                    }
                });

                for (let userCarAd of user.carAds) {
                    Car
                        .findByIdAndRemove(userCarAd)
                        .then(car => {

                            let carImagePath = `./public/images/CarPictures/${car._id}`;

                            fs.unlinkSync(carImagePath, err => {
                                if (err) {
                                    console.log(err.message);
                                }
                            });

                            for (let userPartAd of user.partAds) {
                                Part
                                    .findByIdAndRemove(userPartAd)
                                    .then(part => {

                                        let partImagePath = `./public/images/partPictures/${part._id}`;

                                        fs.unlinkSync(partImagePath, err => {
                                            if (err) {
                                                console.log(err.message);
                                            }
                                        });

                                        for (let userComment of user.comments) {
                                            Comment
                                                .findByIdAndRemove(userComment)
                                                .then(
                                                    res.redirect('/')
                                                )
                                        }

                                    })
                            }

                        })


                }


            })


        res.redirect('/')
    }


}
