import express from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';
import { tokenGenerator } from '../middlewares/middleware';

const app = express();
app.use(bodyParser.json());

//request for creating user account
export const createUser = (req, res) => {
  const { first_name, last_name, email, phone_no, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    client.query('INSERT INTO users (first_name, last_name, email, phone_no, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, phone_no, password], (err, user) => {
      if (err) {
        res.send(err);
      } else {
        console.log(user.rows[0]);
        res.status(201).send({
          success: true,
          message: 'User added successfully!',
          token: tokenGenerator(user.rows[0])
        });
      }
    });
  }
}

//request for logging in
export const userLogin = (req, res) => {
  const { email } = req.body;
  client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, user) => {
    if (err) {
      res.send(err);
    } else if (user.rows.length) {
      const token = tokenGenerator(user.rows[0]);
      res.send({
        message: "Login successful",
        token,
        expiresIn: '24hours'
      });
    } else {
      res.send("User not found!");
    }
  });
}