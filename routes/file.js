const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const File = require('../models/File');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post(
  '/upload',
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
  }
);


router.get(
  '/:id',
  async (req, res) => {
  const id = req.params.id;

  const file = await File.findOne({
    where: { id },
    attributes: {
      exclude: ['fileContent']
    }
  }).catch(err => {
    console.log('Error: ', err);
  });

  (file) ? res.status(200).send({file}) : res.status(404).json({message: 'File not found'}) ;

});



module.exports = router;