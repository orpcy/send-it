"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai.default.expect;
describe('users-route unit test', function () {
  it('should create a new user through the endpoint', function (done) {
    (0, _supertest.default)(_app.default).post('/api/v1/users').send({
      firstName: "ola",
      lastName: "shola",
      email: "adigun@gmail.com",
      phoneNumber: "08143587654"
    }).end(function (err, res) {
      expect(res.status).equal(201);
      expect(res.body.error).equal(undefined);
      expect(res.body.firstName).equal("ola");
      expect(res.body.lastName).equal('shola');
      expect(res.body.email).equal('adigun@gmail.com');
      expect(res.body.phoneNumber).equal('08143587654');
      done();
    });
  });
});