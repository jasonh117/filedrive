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
const sequelize = models.sequelize;
const FileModel = models.File;
const fileConfig = nconf.get('file');
const upload = multer({ dest: fileConfig.location });
const orderbyTable = {
  originalname: 'lower("originalname")',
  updatedAt: '"updatedAt"'
};

router.use(jwt.authenticate);

router.post('/', upload.any(), async (req, res) => {
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

  try {
    const data = await FileModel.bulkCreate(files, options);
    res.status(HTTPStatus.CREATED).json({ data });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.files.map(file => fs.unlinkSync(file.path));
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_SAME_NAME });
      return;
    }
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const folder = req.query.folder || '/';
  const orderby = orderbyTable[req.query.sort] || 'lower("originalname")';
  const desc = req.query.desc === 'true' ? 'DESC' : 'ASC';
  const query = `SELECT * FROM files WHERE "userId"=${userId} AND folder='${folder}' ORDER BY ${orderby} ${desc};`;

  try {
    const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    res.status(HTTPStatus.OK).json({ data });
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

router.get('/:filename', async (req, res) => {
  const userId = req.user.id;
  const filename = req.params.filename;
  const view = req.query.view;
  const where = {
    userId,
    filename
  };

  try {
    const file = await FileModel.findOne({ where });
    if (!file) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_INVALID_NAME });
      return;
    }
    const filePath = path.resolve(fileConfig.location, file.filename);
    if (view) {
      const options = {
        headers: { 'Content-Type': file.mimetype }
      };
      res.status(HTTPStatus.OK).sendFile(filePath, options);
      return;
    }
    res.status(HTTPStatus.OK).download(filePath, file.originalname);
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

router.delete('/:filename', async (req, res) => {
  const userId = req.user.id;
  const filename = req.params.filename;
  const where = {
    userId,
    filename
  };

  try {
    const file = await FileModel.findOne({ where });
    if (!file) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.FILE_INVALID_NAME });
      return;
    }
    const filePath = path.resolve(fileConfig.location, file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await file.destroy();
    res.status(HTTPStatus.OK).end();
  } catch (error) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
});

module.exports = router;
