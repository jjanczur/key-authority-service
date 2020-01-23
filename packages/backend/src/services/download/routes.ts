import * as express from 'express';
import * as jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const downloadRouter = express.Router();

/** GET /api/users */
// downloadRouter.route('/').get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
downloadRouter.route('/').get(controller.get);

/** PATCH /api/users/:userId */
/** Authenticated route */
// downloadRouter
//   .route('/:userId')
//   .get(jwt({ secret: config.secret }), controller.patch);
