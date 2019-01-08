import express from 'express';
import routes from './routes/index';

const app = express();

app.get('/', (req, res) => {
  res.send('testing server.....');
});

app.use('/api/v1', routes);

app.listen(8080, () => {
  console.log('running on port 8080');
});

export default app;