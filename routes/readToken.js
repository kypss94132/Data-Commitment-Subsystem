// GET read-token
// Route to read and save content of token.txt to MySQL
const fs = require('fs');
const readline = require('readline');
const connection = require('./index');

module.exports = (app) => {
  app.get('/read-token', (req, res) => {
    // Adjust path as needed
    const filePath = 'D:\\DIS_platform\\tokens.txt';
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'token.txt does not exist at the specified path' });
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      output: process.stdout,
      terminal: false,
    });

    const textValues = [];
    const typeValues = [];

    rl.on('line', (line) => {
      // Parse the line to extract id, text, and type
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

      // Add to the arrays if valid
      if (text && type) {
        textValues.push(text);
        typeValues.push(type);
      }
    });

    rl.on('close', () => {
      if (!textValues.length || !typeValues.length) {
        return res.status(500).json({ error: 'No valid data found in token.txt' });
      }

      // Save the extracted values into the database
      const query = 'INSERT INTO tokens (Text, Type) VALUES (?, ?)';
      let insertCount = 0;

      textValues.forEach((text, index) => {
        const type = typeValues[index] || null;
        connection.query(query, [text, type], (err) => {
          if (err) {
            console.error('Error saving to database:', err);
            return res.status(500).json({ error: 'Error saving to database' });
          }
          insertCount++;
          if (insertCount === textValues.length) {
            res.json({ message: 'File content saved to database successfully' });
          }
        });
      });
    });

    rl.on('error', (err) => {
      console.error('Error reading token.txt:', err);
      res.status(500).json({ error: `Error reading token.txt: ${err.message}` });
    });
  });
};
