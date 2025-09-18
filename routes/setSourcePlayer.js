const connection = require('./index');

module.exports = (app) => {
  // POST /set-source-player
  app.post('/set-source-player', (req, res) => {
    const sql = `UPDATE verification_data SET SourceData = 'player'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error updating SourceData:', err);
        return res.status(500).json({ error: 'Failed to update SourceData' });
      }

      res.json({
        message: 'SourceData column successfully set to "player" for all rows.',
        affectedRows: result.affectedRows,
      });
    });
  });
};
