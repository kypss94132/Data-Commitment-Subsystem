const connection = require('./index');
// Save source data name for reference
module.exports = (app) => {
  app.post('/save-source', (req, res) => {
    const sql = `UPDATE verification_data SET SourceData = 'player'`;

    connection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update SourceData' });
      }

      res.json({
        message: 'SourceData column set successfully!',
        affectedRows: result.affectedRows,
      });
    });
  });
};
