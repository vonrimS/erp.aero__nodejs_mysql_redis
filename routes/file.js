const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const File = require('../models/File');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const passport = require('passport');
const checkBlacklist = require('../middleware/check-blacklist');



router.post(
  '/upload',
  checkBlacklist,
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  async (req, res) => {

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    const newFile = await File.create({
      filename: file.originalname,
      extension: path.extname(file.originalname),
      mimeType: mime.contentType(file.originalname),
      fileSize: file.size,
      dateUploaded: new Date(),
      fileContent: file.buffer
    }).catch(err => {
      res.json({ error: 'Cannot upload new file' });
    });

    if (newFile) {
      res.json({ message: 'File uploaded successfully' });
    }
  }
);


router.get(
  '/list',
  checkBlacklist,
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {

    const pageSize = parseInt(req.query.list_size) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;

    const files = await File.findAndCountAll({
      limit: pageSize,
      offset: offset,
      attributes: {
        exclude: ['fileContent']
      }
    });

    const totalPages = Math.ceil(files.count / pageSize);

    res.json({
      files: files.rows,
      page: page,
      totalPages: totalPages
    });
  });


module.exports = router;