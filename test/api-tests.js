const expect = require('chai').expect;
const request = require('supertest');
const app = require('./../index');
const User = require('mongoose').model('User');

describe('api tests', function () {
	describe('Home page tests', function () {

		it('Loads the home page: GET /', function (done) {
			request(app)
				.get('/')
				.expect(/Auto Magazine/)
				.expect(200)
				.end(done);
		});

		it('Test home page with / POST, Response should be error page', function (done) {
			request(app).post('/').expect(404).expect(/Page Not Found/).end(done);
		});

		it('Random url: response error page', function (done) {
			request(app).get('/randomUrl/url').expect(404).expect(/Page Not Found/).end(done);
		});
	});

	describe('user endpoints test', function () {

		it('GET /users/register', function (done) {
			request(app)
				.get('/users/register')
				.expect(/Password:/)
				.expect(/First Name:/)
				.expect(/Last Name:/)
				.expect(200)
				.end(done);
		});

		it('GET /users/login', function (done) {
			request(app)
				.get('/users/login')
				.expect(/<input class="form-control" type="text" name="username" placeholder="Username" \/>/)
				.expect(/<input class="form-control" type="password" name="password" placeholder="Password" \/>/)
				.expect(/<input class="btn btn-default" type="submit" value="Login" \/>/)
				.expect(200)
				.end(done);
		});
	});

	describe('part endpoints test', function () {
		it('GET /listAllParts', function (done) {
			request(app)
				.get('/listAllParts')
				.expect(/Parts Magazine/)
				.expect(200)
				.end(done);
		});
	});

	describe('search endpoint test', function () {
		it('POST /search', function (done) {
			request(app)
				.post('/search')
				.send({keyword: 'any'})
				.expect(/<input type="text" class="form-control" name="keyword" placeholder="Type a keyword"><br \/>/)
				.expect(200)
				.end(done);
		});
	});
});