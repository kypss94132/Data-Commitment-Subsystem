const connection = require('./index');
const { extractContent } = require('./sharedModule');

module.exports = (app) => {
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
        return res.status(500).json({ error: 'fetching error' });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: 'No tokens found' });
      }

      let insidePredicate = false;
      let extractedContent = '';
      let startTokenId = 0;
      let endTokenId = 0;

      const insertPromises = [];

      for (let i = 0; i < results.length; i++) {
        const text = results[i].Text;
        const type = results[i].Type;

        if (!insidePredicate) {
          // Detect <predicate> start
          if (
            text === '<' && type === '<' && i + 2 < results.length &&
            results[i + 1].Text === 'predicate' && results[i + 1].Type === 'ID' &&
            results[i + 2].Text === '>' && results[i + 2].Type === '>'
          ) {
            insidePredicate = true;
            startTokenId = results[i].Id;
            i += 2;
            continue;
          }
        } else {
          // Detect </predicate> end
          if (
            text === '<' && type === '<' && i + 3 < results.length &&
            results[i + 1].Text === '/' && results[i + 1].Type === '/' &&
            results[i + 2].Text === 'predicate' && results[i + 2].Type === 'ID' &&
            results[i + 3].Text === '>' && results[i + 3].Type === '>'
          ) {
            endTokenId = results[i + 3].Id;
            const finalContent = extractContent(extractedContent);

            insertPromises.push(new Promise((resolve, reject) => {
              connection.query(insertQuery, [startTokenId, endTokenId, finalContent], (err2) => {
                if (err2) return reject(err2);
                resolve();
              });
            }));

            insidePredicate = false;
            extractedContent = '';
            i += 3;
          } else {
            extractedContent += text;
          }
        }
      }

      Promise.all(insertPromises)
        .then(() => res.json({ message: `${insertPromises.length} predicates extracted.` }))
        .catch(() => res.status(500).json({ error: 'Error inserting predicates' }));
    });
  });
};
