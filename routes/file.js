const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const File = require('../models/File');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require('fs');



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

    (file) ? res.status(200).send({ file }) : res.status(404).json({ message: 'File not found' });

  });



router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  const file = await File.findOne({
    where: { id },
    attributes: {
      exclude: ['fileContent']
    }
  }).catch(err => {
    console.log('Error: ', err);
  });

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // TODO: Delete file from local storage here...

  await file.destroy();

  res.json({ message: 'File deleted successfully' });
});



router.get('/download/:id', async (req, res) => {
  const id = req.params.id;

  const file = await File.findByPk(id);

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  //TODO: Download file from local storage here...

  // Save file to disk
  const filePath = path.join(__dirname, '../downloads', file.filename);
  fs.writeFileSync(filePath, file.fileContent, { encoding: 'binary' });

  // Send file to client for download
  const stream = fs.createReadStream(filePath);
  const stat = fs.statSync(filePath);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  stream.pipe(res);

  console.log(`File downloaded: ${file.filename}`);

  res.json({ message: 'File downloaded successfully' });
});


router.put(
  '/update/:id',
  upload.single('file'),
  async (req, res) => {
    const id = req.params.id;

    const newFile = req.file;

    if (!newFile) {
      return res.status(400).json({ error: 'No file was uploaded' });
    }

    let file = await File.findOne({
      where: { id }
    }).catch(err => {
      console.log('Error: ', err);
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.set({
      filename: newFile.originalname,
      extension: path.extname(newFile.originalname),
      mimeType: mime.contentType(newFile.originalname),
      fileSize: newFile.size,
      updatedAt: new Date(),
      fileContent: newFile.buffer
    });

    file = await file.save();

    // //TODO: Update file in local storage here...

    res.json({ message: 'File updated successfully' });
  });


module.exports = router;