import express from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';

const app = express();
app.use(bodyParser.json());

//request for creating parcel for registered users only
export const createParcel = (req, res) => {
  const { user_id, pickup_location, destination, recipient_name, recipient_phone_no } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query('INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5)', [user_id, pickup_location, destination, recipient_name, recipient_phone_no], (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Parcel created successfully!");
      }
    });
  } else {
    res.status(401).send({ msg: 'Sorry you can not create Parcel Order for another User!' });
  }
};

//request for getting all parcel if admin or get all parcels by a specific user
export const getAllParcels = (req, res) => {
  const {userId} = req.body;
  if (req.decoded.role !== 'admin' && req.decoded.role !== 'member') {
    res.send("Sorry! Only admins and members have access to this endpoint")
  } else if (req.decoded.role === 'admin') {
    client.query('SELECT * from parcels ORDER By id ASC', (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.send(results.rows);
      }
    });
  }else if(req.decoded.role === 'member' && req.decoded.id === parseInt(userId, 10)){
    client.query('SELECT * FROM parcels WHERE user_id = $1', [userId], (err, results) => {
      if(err){
        res.send(err);
      }else{
        res.send(results.rows);
      }
    });
  }
  else {
    res.send("Please enter valid token");
  }
}