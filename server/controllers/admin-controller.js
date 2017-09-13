const encryption = require('../utilities/encryption');
const User = require('mongoose').model('User');
const Car = require('mongoose').model('Car');
const Part = require('mongoose').model('Part');
const Comment = require('mongoose').model('Comment');
const fs = require('fs');

module.exports = {
    listAllUsersGET: (req, res) => {
        let currentUser = res.locals.currentUser.id;

        User.find({'_id': {$ne: currentUser}}).then(users => {

            let isActive1 = '';
            for (let user of users) {
                if(user.isActive === false){
                    user.isActive1 = "Ban"
                }
            }

            res.render('admins/listAllUsers',
                {
                    users: users,
                    isActive: isActive1
                });
        })
    },

    userDetailsGET: (req, res) => {
        let userId = req.params.id;

        User
            .findById(userId)
            .populate('carAds')
            .populate('partAds')
            .populate('comments')
            .then(user => {

                let userIsAdmin = false;

                if(user.roles[0] == 'Admin'){
                    userIsAdmin = true;
                }else{
                    userIsAdmin = false;
                }

                user.userIsAdmin = userIsAdmin;

                res.render('admins/userDetails',
                    {
                        user: user,
                        userRole: user.roles[0]
                    });
            })
    },

    deleteUserByIdGET: (req, res) => {
        let userId = req.params.id;
        console.log(userId);

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
                                                )
                                        }
                                    })
                            }

                        })
                }
            });


        res.redirect('/users/listAllUsers');
    },


    changePermissionUserGET:(req, res) => {
        let userId = req.params.id;

        User.findById(userId).then(user => {

            if(user.roles[0] == 'Admin') {
                user.roles = ['User'];
            }else{
                user.roles = ['Admin'];
            }
            user.save();

            res.redirect(`/userDetails/${userId}`);
        });
    },

    banUserGET:(req,res) => {
        let userId = req.params.id;

        User.findById(userId).then(user => {

            if(user.isActive === true) {
                user.isActive = false;
            }else{
                user.isActive = true;
            }
            user.save();

            res.redirect('/users/listAllUsers');
        });
    }
};