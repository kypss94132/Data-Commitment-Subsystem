const fs = require('fs');
const readline = require('readline');
const connection = require('./index');

module.exports = (app) => {
  app.post('/save-token', (req, res) => {
    const filePath = req.body.path;

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'Token file does not exist' });
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    const textContent = [];
    const typeContent = [];

    rl.on('line', (line) => {
      // Generated token file has specific writing style
      const idStart = line.indexOf('@') + 1;
      const idEnd = line.indexOf(',');
      const id = line.substring(idStart, idEnd);

      const textStart = line.indexOf("='") + 2;
      const textEnd = line.indexOf("',<");
      const text = line.substring(textStart, textEnd);

      const typeStart = line.indexOf(',<') + 2;
      const typeEnd = line.indexOf('>,');
      let type = line.substring(typeStart, typeEnd);

      if (type.includes("'")) {
        type = line.substring(typeStart + 1, typeEnd - 1);
      }

      // Add to array if valid
      if (text && type) {
        textContent.push(text);
        typeContent.push(type);
      }
    });

    rl.on('close', () => {
      if (!textContent.length || !typeContent.length) {
        return res.status(500).json({ error: 'No valid data found' });
      }

      // Save values into DB
      const query = 'INSERT INTO tokens (Text, Type) VALUES (?, ?)';
      let insertCount = 0;

      textContent.forEach((text, index) => {
        const type = typeContent[index] || null;
        connection.query(query, [text, type], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error saving to database' });
          }
          insertCount++;
          if (insertCount === textContent.length) {
            res.json({ message: 'Content saved to database successfully!' });
          }
        });
      });
    });

    rl.on('error', (err) => {
      res.status(500).json({ error: `Error reading TXT: ${err.message}` });
    });
  });
};
