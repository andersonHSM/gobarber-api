import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import AuthMiddleware from './app/middlewares/AuthMiddleware';

import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import UserController from './app/controllers/UserController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users/', UserController.store);
routes.post('/sessions/', SessionController.store);

routes.use(AuthMiddleware);

routes.put('/users/', UserController.update);

routes.get('/providers/', ProviderController.index);

routes.get('/appointments/', AppointmentController.index);
routes.post('/appointments/', AppointmentController.store);

routes.get('/schedule/', ScheduleController.index);

routes.post(
  '/files/',
  upload.single('file') /* nome do campo usado para upload */,
  FileController.store
);
export default routes;
