import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes';
import "reflect-metadata";
import { createConnection } from 'typeorm';

const app: express.Application = express();
dotenv.config();
createConnection();

app.set('port', process.env.APP_PORT || 3000);

//routes
app.use('/api', apiRoutes);

app.listen(app.get('port'), () => {
  console.log(`${process.env.APP_NAME} on port ${app.get('port')}`);
});
