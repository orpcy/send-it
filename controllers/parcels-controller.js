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