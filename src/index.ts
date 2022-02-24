import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import morgan from 'morgan';
import cors from 'cors';

const app: express.Application = express();
dotenv.config();

createConnection();

app.set('port', process.env.APP_PORT || 3000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

//routes
app.use('/api', apiRoutes);

app.listen(app.get('port'), () => {
  console.log(`${process.env.APP_NAME} on port ${app.get('port')}`);
});
