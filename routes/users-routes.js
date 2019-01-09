import express from 'express';
import bodyParser from 'body-parser';
import { createUser, userLogin} from '../controllers/users-controller.js';
import { check } from 'express-validator/check';

const app = express();

app.use(bodyParser.json());

//endpoint  to create User acct
app.post('/users', [
  check(['first_name', 'last_name'])
  .isAlpha().withMessage('must consist of letters only')
  .isLength({min: 3}).withMessage('minimum of 3 characters'),
  check('email', 'Must be a valid email').isEmail(),
  check('password')
  .isLength({min: 5}).withMessage('minimum length of 5')
], createUser);

//endpoint for logging in
app.post('/users/login', userLogin);

export default app;
