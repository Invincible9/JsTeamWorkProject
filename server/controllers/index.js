const home = require('./home-controller')
const users = require('./users-controller')
const cars = require('./car-controller')
const parts = require('./part-controller')

module.exports = {
  home: home,
  users: users,
  cars: cars,
  parts:parts
}
