const express = require('express');
const router = express.Router();
const multer = require('multer');
const { scanReceipt } = require('../controllers/ocrController');
const auth = require('../middleware/auth');

// Setup memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/ocr/scan
router.post('/scan', auth, upload.single('receipt'), scanReceipt);

module.exports = router;