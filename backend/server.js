const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.post('/api/generate', (req, res) => {
  const { name } = req.body;
  const doc = new pdf();
  const filePath = path.join(__dirname, 'certificate.pdf');

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text(`Certificate of Participation`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(20).text(`This certificate is awarded to:`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(30).text(name, { align: 'center' });
  doc.end();

  doc.on('finish', () => {
    res.download(filePath, 'certificate.pdf', (err) => {
      if (err) {
        console.error(err);
      }
      fs.unlinkSync(filePath);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                