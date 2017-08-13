const express = require('express');
const HTTPStatus = require('http-status');
const models = require('../models');
const { errorCodes } = require('../lib/error');
const jwt = require('../lib/jwt');
const validate = require('../lib/validate');

const router = express.Router();
const UserModel = models.User;

const checkBody = (req, res, next) => {
  if (!req.body.email) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
    return;
  }
  if (!validate.isEmail(req.body.email)) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.INVALID_EMAIL });
    return;
  }
  if (!req.body.password) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_PASSWORD });
    return;
  }
  if (!validate.isString(req.body.password)) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.INVALID_PASSWORD });
    return;
  }
  next();
};

router.post('/', checkBody, async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    const userObj = user.toJSON();
    userObj.jwt = jwt.generateToken(userObj);
    res.status(HTTPStatus.CREATED).json({ data: userObj });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_EMAIL_TAKEN });
      return;
    }
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

router.post('/login', checkBody, async (req, res) => {
  const email = validate.normalizeEmail(req.body.email);
  const password = req.body.password;

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_NOT_FOUND });
      return;
    }

    if (!user.comparePassword(password)) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_INVALID_CREDENTIALS });
      return;
    }

    const userObj = user.toJSON();
    userObj.jwt = jwt.generateToken(userObj);
    res.status(HTTPStatus.OK).json({ data: userObj });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

router.patch('/', jwt.authenticate, async (req, res) => {
  const email = req.body.email;
  if (email && !validate.isEmail(email)) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.INVALID_EMAIL });
    return;
  }
  const password = req.body.password;
  if (password && !validate.isString(password)) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.INVALID_PASSWORD });
    return;
  }

  const options = {
    where: { id: req.user.id },
    returning: true
  };

  try {
    const data = await UserModel.update(req.body, options);
    if (!data || data[0] === 0) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_NOT_FOUND });
      return;
    }
    const userObj = data[1][0].toJSON();
    res.status(HTTPStatus.OK).json({ data: userObj });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.USER_EMAIL_TAKEN });
      return;
    }
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

module.exports = router;
