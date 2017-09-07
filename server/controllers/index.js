const home = require('./home-controller')
const users = require('./users-controller')
const cars = require('../controllers/car-controller')
const parts = require('../controllers/part-controller')
const comments = require('../controllers/comment-controller')


module.exports = {
    home: home,
    users: users,
    cars: cars,
    parts: parts,
    comments: comments
}
