import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import usersData from '../usersdata.json';

const app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const newUser = {
    id: usersData.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber
  }

  usersData.push(newUser);

  fs.writeFile('usersdata.json', JSON.stringify(usersData, null, 2), (err) => {
    if(err){
      res.send(err);
    }
    res.status(201).send(newUser);
  });

});

export default app;
