import express from 'express';
import usersRoute from './users-routes';

const app = express();

app.use('/', usersRoute);

export default app;