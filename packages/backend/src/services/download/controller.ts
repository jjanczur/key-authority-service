import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';
const fs = require('fs');

export const find = (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?publicAddress=... is given, then filter results
  const whereClause = req.query &&
    req.query.publicAddress && {
      where: { publicAddress: req.query.publicAddress }
    };

  return User.findAll(whereClause)
    .then(users => res.json(users))
    .catch(next);
};

export const get = (req: Request, res: Response, next: NextFunction) => {
  console.log('file');
  console.log(process.cwd());
  const path = './src/services/download/data/Hamlet.pdf';
  const file = fs.createReadStream(path);
  file.pipe(res);
  // return res;
};

export const patch = (req: Request, res: Response, next: NextFunction) => {
  // Only allow to fetch current user
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  return User.findByPk(req.params.userId)
    .then(async user => {
      if (!user) {
        return user;
      }

      Object.assign(user, req.body);
      return user.save();
    })
    .then(user => {
      return user
        ? res.json(user)
        : res.status(401).send({
            error: `User with publicAddress ${
              req.params.userId
            } is not found in database`
          });
    })
    .catch(next);
};
