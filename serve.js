/*
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
    INSERT INTO predicate (StartTokenID, EndTokenID, PredicateText) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
      StartTokenID = VALUES(StartTokenID), 
      EndTokenID = VALUES(EndTokenID),
      PredicateText = VALUES(PredicateText)
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

          // ** Pass `0` for Disjunction and Conjunction **
          const insertPromise = new Promise((resolve, reject) => {
            connection.query(insertQuery, [startTokenId, endTokenId, finalContent], (err) => {
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
app.post('/split-predicate', (req, res) => {
  const selectQuery = 'SELECT PredicateID, PredicateText FROM predicate';
  const insertQuery = `
    INSERT INTO verification_data (PredicateID, RawText, ConnectOperator)
    VALUES (?, ?, ?)
  `;

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching predicates:', err);
      return res.status(500).json({ error: 'Error fetching predicates' });
    }

    const insertPromises = [];

    results.forEach(row => {
      const { PredicateID, PredicateText } = row;

      let operator = null;
      let subPredicates = [PredicateText];

      if (PredicateText.includes('AND')) {
        operator = 'AND';
        subPredicates = PredicateText.split('AND');
      } else if (PredicateText.includes('OR')) {
        operator = 'OR';
        subPredicates = PredicateText.split('OR');
      }

      subPredicates.forEach((sub, index) => {
        const trimmedSub = sub.trim();
        const op = (index === 0 && operator) ? operator : null;

        insertPromises.push(
          new Promise((resolve, reject) => {
            connection.query(insertQuery, [PredicateID, trimmedSub, op], (err) => {
              if (err) return reject(err);
              resolve();
            });
          })
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => res.json({ message: 'Verification data inserted successfully.' }))
      .catch(err => {
        console.error('Error inserting verification data:', err);
        res.status(500).json({ error: 'Insertion failed' });
      });
  });
});
//Parses verification_data.RawText, Queries the corresponding source table (player) saved in SourceData, Computes the expression, save true false for each expression
app.post('/calculate-verification', (req, res) => {
  const selectQuery = `
    SELECT ID, PredicateID, RawText, SourceData 
    FROM verification_data 
    WHERE RawText IS NOT NULL AND SourceData IS NOT NULL
  `;

  const updateQuery = `
    UPDATE verification_data 
    SET CalculatedResult = ? 
    WHERE ID = ?
  `;

  connection.query(selectQuery, async (err, rows) => {
    if (err) {
      console.error('Error fetching verification data:', err);
      return res.status(500).json({ error: 'Error fetching verification data' });
    }

    const promises = rows.map(row => {
      const { ID, RawText, SourceData } = row;

      try {
        // Extract expression, operator, value
        const match = RawText.match(/\(?([A-Za-z0-9_]+)\/([A-Za-z0-9_]+)\)?\s*([=><!]+)\s*(\d*\.?\d+)/);
        if (!match) {
          throw new Error(`Invalid format in RawText: ${RawText}`);
        }

        const [_, numerator, denominator, operator, targetValueStr] = match;
        const targetValue = parseFloat(targetValueStr);

        const sourceTable = SourceData;

        // Construct SQL query to get numerator and denominator
        const valueQuery = `
          SELECT \`${numerator}\` AS num, \`${denominator}\` AS denom 
          FROM \`${sourceTable}\` 
          WHERE \`${numerator}\` IS NOT NULL AND \`${denominator}\` IS NOT NULL AND \`${denominator}\` != 0
        `;

        return new Promise((resolve, reject) => {
          connection.query(valueQuery, (err, results) => {
            if (err) {
              console.error(`Error querying source table ${sourceTable}:`, err);
              return reject(err);
            }

            let matchFound = false;

            for (const row of results) {
              const computed = row.num / row.denom;

              switch (operator) {
                case '=':
                case '==':
                  matchFound = computed === targetValue;
                  break;
                case '>':
                  matchFound = computed > targetValue;
                  break;
                case '<':
                  matchFound = computed < targetValue;
                  break;
                case '>=':
                  matchFound = computed >= targetValue;
                  break;
                case '<=':
                  matchFound = computed <= targetValue;
                  break;
                case '!=':
                case '<>':
                  matchFound = computed !== targetValue;
                  break;
              }

              if (matchFound) break; // Only need one match
            }

            const finalResult = matchFound ? 'True' : 'False';

            connection.query(updateQuery, [finalResult, ID], (err) => {
              if (err) {
                console.error('Error updating CalculatedResult:', err);
                return reject(err);
              }
              resolve();
            });
          });
        });
      } catch (err) {
        console.error(`Parsing error for ID ${ID}:`, err);
        return Promise.resolve(); // Skip and continue with others
      }
    });

    Promise.all(promises)
      .then(() => {
        res.json({ message: 'Verification results calculated and saved.' });
      })
      .catch(err => {
        res.status(500).json({ error: 'Error during calculation' });
      });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
*/
// serve.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Register routes
require('./routes/readToken')(app);
require('./routes/extractPredicate')(app);
require('./routes/splitPredicate')(app);
//require('./routes/calculateVerification')(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
