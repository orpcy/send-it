import supertest from 'supertest';
import chai from 'chai';
import app from '../app';

//using expect methof from chai
const expect = chai.expect;

describe('create new parcel order unit test', () => {
  //test for creating new parcel
  it('should create a new parcel delivery order', (done) => {
    supertest(app)
      .post('/api/v1/parcels')
      .send({
        userId: 2,
        pickupLocation: 'anthony',
        destination: 'ikorodu',
        recipientName: 'gold',
        recipientPhoneNo: '09065489324'
      })
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.error).equal(undefined);
        expect(res.body.userId).equal(2);
        expect(res.body.pickupLocation).equal('anthony');
        expect(res.body.destination).equal('ikorodu');
        expect(res.body.recipientName).equal('gold');
        expect(res.body.recipientPhoneNo).equal('09065489324');
        done();
      });
  });
  //it should not create if user id does not exist
  it('should create not create a parcel delivery order if userId not found', (done) => {
    supertest(app)
      .post('/api/v1/parcels')
      .send({
        userId: 9
      })
      .end((err, res) => {
        expect(res.status).equal(401);
        expect(res.body.error).equal(undefined);
        expect(res.body.msg).equal('please create a user account first');
        done();
      });
  });
});

describe('unit test to get all parcel delivery orders', () => {
  //test to get all parcel orders
  it('should get all parcels orders', (done) => {
    supertest(app)
      .get('/api/v1/parcels')
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.error).equal(undefined);
        expect(Array.isArray(res.body)).equal(true);
        done();
      });
  });
})

describe('unit test to get a specific parcel delivery order', () => {
  //test to get a specific parcel order
  it('should get a specific parcel order', (done) => {
    supertest(app)
      .get('/api/v1/parcels/2')
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.error).equal(undefined);
        expect(res.body.id).equal(2);
        done();
      });
  });

  //it should return error if parcel is not found
  it('should return error if parcel id is not found', (done) => {
    supertest(app)
      .get('/api/v1/parcels/66')
      .end((err, res) => {
        expect(res.status).equal(404);
        expect(res.body.error).equal(undefined);
        expect(res.text).equal('Parcel order does not exist');
        done();
      });
  });
})

describe('test to cancel a parcel delivery order', () => {
  it('should cancel a parcel delivery order', done => {
    supertest(app)
      .patch('/api/v1/parcels/23/cancel')
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.error).equal(undefined);
        expect(res.body.status).equal('cancelled');
        done();
      });
  });

  it('should not cancel if status is delivered', done => {
    supertest(app)
      .patch('/api/v1/parcels/5/cancel')
      .end((err, res) => {
        expect(res.status).equal(403);
        expect(res.body.error).equal(undefined);
        expect(res.text).equal("sorry you cant cancel this order because it has already been delivered");
        done();
      });
  });
});


