const express = require('express');
const HTTPStatus = require('http-status');
const multer = require('multer');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');
const models = require('../models');
const { errorCodes } = require('../lib/error');
const jwt = require('../lib/jwt');

const router = express.Router();
const FileModel = models.File;
const fileConfig = nconf.get('file');
const upload = multer({ dest: fileConfig.location });

router.use(jwt.authenticate);

router.post('/', upload.any(), (req, res) => {
  if (!req.files || !req.files.length || req.files.length < 1) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_FILES });
    return;
  }

  const permission = req.body.permission;
  const folder = req.body.folder;
  const userId = req.user.id;
  const files = req.files.map(file => ({
    originalname: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    encoding: file.encoding,
    permission: permission || 'private',
    userId,
    folder: folder || '/'
  }));
  const options = {
    returning: true
  };

  FileModel.bulkCreate(files, options)
    .then((returnFiles) => {
      res.status(HTTPStatus.CREATED).json({ data: returnFiles });
    })
    .catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        req.files.map(file => fs.unlinkSync(file.path));
        res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_SAME_NAME });
        return;
      }
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

router.get('/', (req, res) => {
  const userId = req.user.id;
  const folder = req.query.folder;
  const where = {
    userId,
    folder: folder || '/'
  };

  FileModel.findAll({ where })
    .then((returnFiles) => {
      res.status(HTTPStatus.OK).json({ data: returnFiles });
    })
    .catch((error) => {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

router.get('/:filename', (req, res) => {
  const userId = req.user.id;
  const filename = req.params.filename;
  const view = req.query.view;
  const where = {
    userId,
    filename
  };

  FileModel.findOne({ where })
    .then((file) => {
      if (!file) {
        res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_INVALID_NAME });
      }
      if (view) {
        return res.status(HTTPStatus.OK)
          .sendFile(path.resolve(fileConfig.location, file.filename), {
            headers: { 'Content-Type': file.mimetype }
          });
      }
      res.status(HTTPStatus.OK)
        .download(path.resolve(fileConfig.location, file.filename), file.originalname);
    })
    .catch((error) => {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

router.delete('/:filename', (req, res) => {
  const userId = req.user.id;
  const filename = req.params.filename;
  const where = {
    userId,
    filename
  };

  FileModel.findOne({ where })
    .then((file) => {
      if (!file) {
        res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_INVALID_NAME });
      }
      const filePath = path.resolve(fileConfig.location, file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return file.destroy();
    })
    .then(() => {
      res.status(HTTPStatus.OK).end();
    })
    .catch((error) => {
      res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
    });
});

module.exports = router;
