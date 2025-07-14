const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const readline = require('readline');

const app = express();
const port = 5000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'kypss94132',  // Replace with your MySQL password
  database: 'parser',  // Replace with your database name
});

// Establish connection to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Serve a basic hello message
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Route to read and save content of token.txt to MySQL
app.get('/read-token', (req, res) => {
  const filePath = 'D:\\DIS_platform\\tokens.txt'; // Adjust the path as needed

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: 'token.txt does not exist at the specified path' });
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  let textValues = [];
  let typeValues = [];

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
    let type = line.substring(typeStart, typeEnd);  // Use 'let' instead of 'const' to allow reassignment

    if (type.includes("'")) {  // Check if single quotes exist in 'type'
        type = line.substring(typeStart + 1, typeEnd - 1);  // If single quotes exist, remove them
    }

    // Add to the arrays if valid
    if (text && type) {
      textValues.push(text);
      typeValues.push(type);
    }
  });

  rl.on('close', () => {
    console.log('File Content:');
    console.log('Text Values:', textValues);
    console.log('Type Values:', typeValues);

    if (textValues.length === 0 || typeValues.length === 0) {
      return res.status(500).json({ error: 'No valid data found in token.txt' });
    }

    // Save the extracted values into the database
    const query = 'INSERT INTO tokens (Text, Type) VALUES (?, ?)';

    let insertCount = 0;
    textValues.forEach((text, index) => {
      const type = typeValues[index] || null; // Handle missing type values
      connection.query(query, [text, type], (err, results) => {
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

// For Predicate Extractor to extract content logic (like C++ extractContent function)
// Extract content inside predicate
function extractContent(text) {
  let start = text.indexOf("[CDATA[");
  let end = text.lastIndexOf("]]");
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start + 7, end - 1).trim(); // Extract only CDATA content
  }
  return text.trim();
}


// Extract operator (">", "<", etc.) and operands (left and right)
function extractPredicateParts(extractedContent) {
  // Example: "Average(weather.precipitation) > 5"
  const match = extractedContent.match(/^(.+?)\s*([><=!]+)\s*(.+)$/);
  
  if (match) {
    return {
      leftOperand: match[1].trim(),
      operator: match[2].trim(),
      rightOperand: match[3].trim(),
    };
  }

  return { leftOperand: null, operator: null, rightOperand: null };
}

// API to extract predicates from `tokens` and save to `predicate`
app.post('/extract-predicate', (req, res) => {
  const selectQuery = 'SELECT Id, Text, Type FROM tokens ORDER BY Id';
  const insertQuery = `
    INSERT INTO predicate (StartTokenID, EndTokenID, Disjunction, Conjunction, LeftOperand, Operator, RightOperand, RawText) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
      StartTokenID = VALUES(StartTokenID), 
      EndTokenID = VALUES(EndTokenID),
      LeftOperand = VALUES(LeftOperand), 
      Operator = VALUES(Operator), 
      RightOperand = VALUES(RightOperand), 
      RawText = VALUES(RawText)
  `;

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching tokens:', err);
      return res.status(500).json({ error: 'Error fetching tokens from database' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'No tokens found in database' });
    }

    let inPredicate = false;
    let extractedContent = "";
    let startTokenId = 0;
    let endTokenId = 0;
    let insertCount = 0;
    let totalInserts = 0;

    const insertPromises = [];

    for (let i = 0; i < results.length; i++) {
      let text = results[i].Text;
      let type = results[i].Type;

      if (!inPredicate) {
        // Detect <predicate> start
        if (text === "<" && type === "<" && i + 2 < results.length &&
            results[i + 1].Text === "predicate" && results[i + 1].Type === "ID" &&
            results[i + 2].Text === ">" && results[i + 2].Type === ">") {
          inPredicate = true;
          startTokenId = results[i].Id;
          i += 2; // Move index past "<predicate>"
          continue;
        }
      } else {
        // Detect </predicate> end
        if (text === "<" && type === "<" && i + 3 < results.length &&
            results[i + 1].Text === "/" && results[i + 1].Type === "/" &&
            results[i + 2].Text === "predicate" && results[i + 2].Type === "ID" &&
            results[i + 3].Text === ">" && results[i + 3].Type === ">") {
          endTokenId = results[i + 3].Id; // End token ID of ">"

          let finalContent = extractContent(extractedContent);
          let { leftOperand, operator, rightOperand } = extractPredicateParts(finalContent);

          // Ensure missing values are replaced with NULL or default values
          leftOperand = leftOperand || null;
          operator = operator || null;
          rightOperand = rightOperand || null;

          // ** Pass `0` for Disjunction and Conjunction **
          const insertPromise = new Promise((resolve, reject) => {
            connection.query(insertQuery, [startTokenId, endTokenId, 0, 0, leftOperand, operator, rightOperand, finalContent], (err) => {
              if (err) {
                console.error('Error inserting predicate:', err);
                reject(err);
              } else {
                insertCount++;
                resolve();
              }
            });
          });

          insertPromises.push(insertPromise);

          inPredicate = false;
          extractedContent = ""; // Reset for next predicate
          i += 3; // Move index past "</predicate>"
        } else {
          // Collect text inside predicate
          extractedContent += text;
        }
      }
    }

    // Ensure all insert operations finish before responding
    Promise.all(insertPromises)
      .then(() => {
        res.json({ message: `Processed tokens. ${insertCount} predicates extracted.` });
      })
      .catch(() => {
        res.status(500).json({ error: 'Error inserting predicates into database' });
      });
  });
});

// For DataExtractor, API to copy PredicateID from predicate to verification_data
app.post('/copy-predicateID', (req, res) => {
  // Query to fetch all PredicateIDs from the predicate table
  const selectQuery = 'SELECT PredicateID FROM predicate';

  // Query to insert PredicateID into verification_data table
  const insertQuery = 'INSERT INTO verification_data (PredicateID) VALUES (?)';

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching PredicateID from predicate:', err);
      return res.status(500).json({ error: 'Error fetching PredicateID from predicate table' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'No PredicateIDs found in predicate table' });
    }

    let insertCount = 0;

    // Loop through each PredicateID and insert into verification_data table
    results.forEach(row => {
      connection.query(insertQuery, [row.PredicateID], (err) => {
        if (err) {
          console.error('Error inserting PredicateID into verification_data:', err);
        } else {
          insertCount++;
        }
      });
    });

    res.json({ message: `${insertCount} PredicateIDs copied to verification_data table.` });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
