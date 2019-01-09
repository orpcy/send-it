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

//request for changing destination for a parcel delivery. accessible only by the user that created that parcel
export const changeDestination = (req, res) => {
  const { destination, user_id } = req.body;

  if(req.decoded.id === parseInt(user_id, 10)){
    client.query('UPDATE parcels SET destination = $1 RETURNING *', [destination], (err, results) => {
      if(err){
        res.send(err);
      }else {
        res.send({
          msg: "Destination changed successfully",
          details: results.rows[0]
        });
      }
    })
  }else {
    res.send("Sorry! You can't change the destination for another user's parcel");
  }
}

//request for changing status. accessible by the admins only
export const changeStatus = (req, res) => {
  const {status, parcelId} = req.body;

  if(req.decoded.role !== 'admin'){
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  }else {
    client.query('UPDATE Parcels SET status = $1 WHERE id = $2 RETURNING *', [status, parcelId], (err, results) => {
      if(err){
        res.send(err);
      }else{
        res.send({
          msg: 'status changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
}

//request for changing present location. accessible by admins only
export const changePresentLocation = (req, res) => {
  const {presentLocation, parcelId} = req.body;

  if(req.decoded.role !== 'admin'){
    res.send({
      msg: 'failed! Only admins can access this endpoint'
    });
  }else {
    client.query('UPDATE Parcels SET present_location = $1 WHERE id = $2 RETURNING *', [presentLocation, parcelId], (err, results) => {
      if(err){
        res.send(err);
      }else{
        res.send({
          msg: 'present location changed successfully',
          details: results.rows[0]
        });
      }
    });
  }
}