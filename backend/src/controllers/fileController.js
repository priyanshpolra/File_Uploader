const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/s3.config');
const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    // Validate file existence
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit'
      });
    }

    // Generate unique file key
    const fileKey = `uploads/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;

    // Prepare S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    // Upload to S3
    console.log('Uploading to S3:', { bucket: params.Bucket, key: params.Key });
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate public URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Save file metadata to MongoDB
    const file = new File({
      filename: req.file.originalname,
      originalname: req.file.originalname,
      url: fileUrl,
      key: fileKey,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    });

    await file.save();
    console.log('File saved to database:', file._id);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        url: file.url,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: file.uploadedAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find()
      .select('-__v')
      .sort({ uploadedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: files.length,
      files: files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.key
    });

    await s3Client.send(deleteCommand);
    await file.deleteOne();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};