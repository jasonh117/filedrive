const nconf = require('nconf');
const HTTPStatus = require('http-status');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { errorCodes } = require('./error');

const jwtConfig = nconf.get('jwt');
const UserModel = models.User;
const jwtOptions = {
  expiresIn: jwtConfig.jwtConfig
};

exports.generateToken = obj => jwt.sign(obj, jwtConfig.secret, jwtOptions);

exports.authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.JWT_MISSING_HEADER });
    return;
  }

  let mechanism = null;
  let token = null;
  [mechanism, token] = authHeader.split(' ');
  if (mechanism !== 'JWT') {
    res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.JWT_INVALID_HEADER });
    return;
  }

  jwt.verify(token, jwtConfig.secret, jwtOptions, (err, decoded) => {
    if (err) {
      res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.JWT_INVALID });
      return;
    }

    const where = { id: decoded.id };
    UserModel.findOne({ where })
      .then((user) => {
        if (!user) {
          res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.JWT_UNAUTHORIZED });
          return;
        }
        req.user = user.toJSON();
        next();
      })
      .catch((error) => {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
      });
  });
};
