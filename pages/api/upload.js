import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload.single('image')(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Resize image to 400px width, maintain aspect ratio
      const resizedImagePath = path.join(uploadDir, 'resized-' + req.file.filename);

      await sharp(req.file.path)
        .resize({ 
          width: 400, 
          height: 300, 
          fit: 'cover' 
        })
        .jpeg({ quality: 85 })
        .toFile(resizedImagePath);

      // Delete original uploaded file to save space
      fs.unlinkSync(req.file.path);

      const filename = 'resized-' + req.file.filename;

      console.log('File uploaded and resized successfully:', {
        filename: filename,
        originalSize: req.file.size,
        resizedDimensions: '400x300px'
      });

      res.status(200).json({
        success: true,
        imagePath: filename,
        filename: filename
      });

    } catch (resizeError) {
      console.error('Image resize error:', resizeError);
      // If resize fails, try to clean up
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      return res.status(500).json({ error: 'Image resizing failed' });
    }
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};
