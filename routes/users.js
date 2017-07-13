const express = require('express');
const HTTPStatus = require('http-status');
const models = require('../models');
const { errorCodes } = require('../lib/error');

const router = express.Router();
const UserModel = models.User;

router.post('/', (req, res) => {
  if (!req.body.email || !req.body.email.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
    return;
  }

  if (!req.body.password || !req.body.password.trim()) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_PASSWORD });
    return;
  }

  UserModel.create(req.body)
    .then((user) => {
      res.status(HTTPStatus.CREATED).json(user);
    })
    .catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_EMAIL_TAKEN });
        return;
      }
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

module.exports = router;
