import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import morgan from 'morgan';

import router from './router';

const app = express();

app.use(cors());
app.locals.serialInfo = {
  connected: false,
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

app.use(router);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send(`Sorry 404 on ${req.url}`);
});
export = app;
