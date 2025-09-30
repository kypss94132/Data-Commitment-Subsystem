const connection = require('./index');
const DEFAULT_OPERATOR = 'OR';

function reduceAND(values) {
  let hasNull = false;
  for (const v of values) {
    if (v === 0) return 0;
    if (v === null || v === undefined) hasNull = true;
  }
  return hasNull ? null : 1;
}

function reduceOR(values) {
  let hasNull = false;
  let hasOne = false;
  for (const v of values) {
    if (v === 1) { hasOne = true; break; }
    if (v === null || v === undefined) hasNull = true;
  }
  if (hasOne) return 1;

  let allZero = true;
  for (const v of values) {
    if (v !== 0) { allZero = false; break; }
  }
  if (allZero) return 0;

  return hasNull ? null : 0; 
}

/**
 * Compute final result for one PredicateID group.
 * @param {Array<{CalculatedResult: (0|1|null), ConnectOperator: ('AND'|'OR'|null)}>} rows
 * @returns {0|1|null}
 */
function computeFinalForGroup(rows) {
  const results = rows.map(r => (r.CalculatedResult === 0 || r.CalculatedResult === 1) ? r.CalculatedResult : null);

  let op = null;
  for (const r of rows) {
    if (r.ConnectOperator && typeof r.ConnectOperator === 'string') {
      const upper = r.ConnectOperator.toUpperCase();
      if (upper === 'AND' || upper === 'OR') {
        op = upper;
        break; 
      }
    }
  }

  if (!op) {
    if (rows.length <= 1) {
      return results[0] ?? null;
    }
    op = DEFAULT_OPERATOR;
  }

  if (op === 'AND') return reduceAND(results);
  if (op === 'OR')  return reduceOR(results);

  return reduceOR(results);
}

module.exports = (app) => {
  app.post('/finalize-predicate', (req, res) => {
    const q = `
      SELECT PredicateID, CalculatedResult, ConnectOperator
      FROM verification_data
      WHERE PredicateID IS NOT NULL
      ORDER BY PredicateID, ID
    `;

    connection.query(q, async (err, rows) => {
      if (err) {
        console.error('Error fetching verification_data:', err);
        return res.status(500).json({ error: 'DB error reading verification_data' });
      }

      const groups = new Map();
      for (const r of rows) {
        if (!groups.has(r.PredicateID)) groups.set(r.PredicateID, []);
        groups.get(r.PredicateID).push({
          CalculatedResult: (r.CalculatedResult === 0 || r.CalculatedResult === 1) ? r.CalculatedResult : null,
          ConnectOperator: r.ConnectOperator ? String(r.ConnectOperator).toUpperCase() : null,
        });
      }

      const tasks = [];
      for (const [predicateId, groupRows] of groups.entries()) {
        const finalVal = computeFinalForGroup(groupRows); 

        tasks.push(new Promise((resolve) => {
          connection.query(
            'UPDATE predicate SET VerificationResult = ? WHERE PredicateID = ?',
            [finalVal, predicateId],
            (uErr) => {
              if (uErr) console.error(`Update VerificationResult failed`, uErr);
              resolve();
            }
          );
        }));
      }

      Promise.all(tasks)
        .then(() => res.json({ message: 'VerificationResult updated' }))
        .catch(() => res.status(500).json({ error: 'Unexpected error while updating' }));
    });
  });
};
