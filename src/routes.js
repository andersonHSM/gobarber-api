import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import AuthMiddleware from './app/middlewares/AuthMiddleware';

import AppointmentController from './app/controllers/AppointmentController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users/', UserController.store);
routes.post('/sessions/', SessionController.store);

routes.use(AuthMiddleware);

routes.put('/users/', UserController.update);

routes.get('/providers/', ProviderController.index);

routes.post('/appointments/', AppointmentController.store);

routes.post(
  '/files/',
  upload.single('file') /* nome do campo usado para upload */,
  FileController.store
);
export default routes;
