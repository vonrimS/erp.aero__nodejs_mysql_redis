const express = require('express');
const router = express.Router();

const User = require('../models/file');


router.post('/upload', (req, res)=> {
    res.send('[upload] is working');
})

router.get('/list', (req, res)=> {
    res.send('[list] is working');
})

router.delete('/delete/:id', (req, res)=> {
    res.send('[delete/:id] is working');
})

router.get('/:id', (req, res)=> {
    res.send('[get/:id] is working');
})

router.get('/download/:id', (req, res)=> {
    res.send('[download/:id] is working');
})

router.put('/update/:id', (req, res)=> {
    res.send('[upload] is working');
})


module.exports = router;