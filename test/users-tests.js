import chai from 'chai';
import supertest from 'supertest';
import app from '../app';

const expect = chai.expect;

describe('users-route unit test',  () => {
  it('should create a new user through the endpoint', (done) => {
    supertest(app)
      .post('/api/v1/users')
      .send({
        firstName: "ola",
        lastName: "shola",
        email: "adigun@gmail.com",
        phoneNumber: "08143587654"        
      })
      .end((err, res) => {
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