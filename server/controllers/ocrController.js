const Tesseract = require('tesseract.js');

exports.scanReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a receipt image." });
  }

  try {
    const { data: { text } } = await Tesseract.recognize(
      req.file.buffer, // Buffer from multer middleware
      'eng',
      { logger: m => console.log(m) }
    );

    // Basic RegEx logic to find the total amount (e.g., $12.99 or 12.99)
    const amountMatch = text.match(/Total[:\s]*\$?([\d,]+\.\d{2})/i);
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);

    res.json({
      extractedText: text,
      suggestedAmount: amountMatch ? amountMatch[1] : null,
      suggestedDate: dateMatch ? dateMatch[1] : null,
      message: "OCR processing complete"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to scan receipt" });
  }
};