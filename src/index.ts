import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app: express.Application = express();
dotenv.config();

createConnection();

app.set('port', process.env.APP_PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/api', apiRoutes);

app.listen(app.get('port'), () => {
  console.log(`${process.env.APP_NAME} on port ${app.get('port')}`);
});
