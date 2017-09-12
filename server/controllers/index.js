const home = require('./home-controller');
const users = require('./users-controller');
const cars = require('../controllers/car-controller');
const parts = require('../controllers/part-controller');
const comments = require('../controllers/comment-controller');
const search = require('../controllers/search-controller');
const message = require('../controllers/message-controller');

module.exports = {
    home: home,
    users: users,
    cars: cars,
    parts: parts,
    comments: comments,
    search: search,
    message: message
}
