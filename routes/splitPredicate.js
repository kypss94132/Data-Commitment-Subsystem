const connection = require('./index');

module.exports = (app) => {
    app.post('/split-predicate', (req, res) => {
        const selectQuery = 'SELECT PredicateID, PredicateText FROM predicate';
        const insertQuery = `
          INSERT INTO verification_data (PredicateID, SubPredicateText, ConnectOperator)
          VALUES (?, ?, ?)
        `;
      
        connection.query(selectQuery, (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'fetching error' });
          }
      
          const insertPromises = [];
      
          results.forEach(row => {
            const { PredicateID, PredicateText } = row;
      
            let operator = null;
            let subPredicates = [PredicateText];
            
            //Split predicate if contains 'AND' 'OR'
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
            .then(() => res.json({ message: 'Inserted successfully!'}))
            .catch(err => {
              console.error('Error inserting verification data:', err);
              res.status(500).json({ error: 'Insertion failed' });
            });
        });
    });
}
