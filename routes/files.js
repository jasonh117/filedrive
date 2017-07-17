const express = require('express');
const HTTPStatus = require('http-status');
const multer = require('multer');
const models = require('../models');
const { errorCodes } = require('../lib/error');
const jwt = require('../lib/jwt');

const router = express.Router();
const FileModel = models.File;
const upload = multer({ dest: './files/' });

router.post('/', jwt.authenticate, upload.any(), (req, res) => {
  if (!req.files || !req.files.length || req.files.length < 1) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_FILES });
    return;
  }

  const userId = req.user.id;
  const files = req.files.map(file => ({
    name: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    permission: 'public',
    userId
  }));
  const options = {
    returning: true
  };

  FileModel.bulkCreate(files, options)
    .then((returnFiles) => {
      res.status(HTTPStatus.CREATED).json({ data: returnFiles });
    })
    .catch((error) => {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

module.exports = router;
