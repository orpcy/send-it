import express from 'express';
import bodyParser from 'body-parser';
import { createParcel, getAllParcels, changeDestination, changeStatus, changePresentLocation } from '../controllers/parcels-controller.js';
import { check } from 'express-validator/check';
import { authorizeUser } from '../middlewares/middleware.js';

const app = express();

app.use(bodyParser.json());

//create a new parcel order.
app.post('/parcels', authorizeUser, [ 
  check('recipient_name').isAlphanumeric().withMessage('Name must be letterrs and numbers only'),
  check('recipient_phone_no')
  .isNumeric().withMessage('Enter numbers only')
  .isLength({ max: 11}).withMessage('Phone number cannot be more than 11 digits')
], createParcel);

//get all parcel orders
app.get('/parcels', authorizeUser, getAllParcels);

//change destination of an order
app.patch('/parcels/destination', authorizeUser, changeDestination);

//change status of an order
app.patch('/parcels/status', authorizeUser, changeStatus);

//change present location of an order
app.patch('/parcels/presentLocation', authorizeUser, changePresentLocation);

export default app;