import express from 'express';
import bodyParser from 'body-parser';
import parcelData from '../parceldata.json';
import usersData from '../usersdata.json';
import fs from 'fs';

const app = express();

app.use(bodyParser.json());

//create a new parcel order. Only users can create orders
app.post('/parcels', (req, res) => {
  const newParcel = {
    id: parcelData.length + 1,
    userId: req.body.userId,
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    recipientName: req.body.recipientName,
    recipientPhoneNo: req.body.recipientPhoneNo,
    status: "processing"
  }

  const validUser = usersData.find(user => user.id === newParcel.userId);
  if (!validUser) {
    res.status(401).send({msg: 'please create a user account first'});
  } else {
    parcelData.push(newParcel);

    fs.writeFile('parceldata.json', JSON.stringify(parcelData, null, 2), (err) => {
      if (err) {
        res.send(err);
      }
      res.send(newParcel);
    });
  }

});

export default app;