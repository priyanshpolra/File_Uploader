const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFiles, deleteFile } = require('../controllers/fileController');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('file'), uploadFile);
router.get('/files', getFiles);
router.delete('/files/:id', deleteFile);

module.exports = router;