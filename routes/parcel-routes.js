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

//get all parcel orders
app.get('/parcels', (req, res) => {
  res.status(200).send(parcelData);
});

//get a specific parcel order
app.get('/parcels/:id', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const parcelItem = parcelData.find(parcel => parcel.id === parcelId);
  if (!parcelItem) {
    res.status(404).send('Parcel order does not exist');
  } else {
    res.status(200).send(parcelItem);
  }
});

//get all parcel orders by a specific user
app.get('/users/:id/parcels', (req, res) => {
  const findId = parseInt(req.params.id, 10);
  const userParcels = parcelData.filter(parcel => parcel.userId === findId);
  res.status(200).send(userParcels);
});

//cancel a specific order
app.patch('/parcels/:id/cancel', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const cancelOrder = parcelData.find(parcel => parcel.id === parcelId);
  if (cancelOrder.status === "delivered") {
    res.status(403).send("sorry you cant cancel this order because it has already been delivered");
  } else {
    cancelOrder.status = 'cancelled';
    fs.writeFile('parceldata.json', JSON.stringify(parcelData, null, 2), (err) => {
      if (err) {
        res.send(err);
      }
      res.send(cancelOrder);
    })
  }
});

export default app;