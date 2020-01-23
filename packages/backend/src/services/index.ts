import * as express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';
import { downloadRouter } from './download';

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
services.use('/download', downloadRouter);
