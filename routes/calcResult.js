const connection = require('./index');

const DEFAULT_TABLE = 'player'; 
const EPS = 1e-9;

const COL_ALIAS = {
  h: 'hits',
  hits: 'hits',
  ab: 'at_bats',
  at_bats: 'at_bats',
  r: 'runs',
  runs: 'runs',
  g: 'games',
  games: 'games',
};

function normalizeCol(name) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  return COL_ALIAS[key] || null; 
}

function parseSubPredicateText(raw) {
  if (!raw) return null;
  const s = raw.replace(/\s+/g, '');

  let isAverage = false;
  let searchStr = s;
  if (/^Average\(/i.test(s)) {
    const close = s.lastIndexOf(')');
    if (close > 8) {
      isAverage = true;
      searchStr = s.slice('Average('.length, close); 
    }
  }

  const fracRe = /([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\/([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)/;
  const fracMatch = searchStr.match(fracRe);
  if (!fracMatch) return null;

  const fraction = fracMatch[0];
  const [lhsIdent, rhsIdent] = fraction.split('/');

  const numeratorCol = normalizeCol(lhsIdent.split('.').pop());
  const denominatorCol = normalizeCol(rhsIdent.split('.').pop());
  if (!numeratorCol || !denominatorCol) return null;

  const fracInS = s.indexOf(fraction);
  if (fracInS === -1) return null;

  const opNumRe = /([=<>!]=?|<>)(-?\d+(?:\.\d+)?)/g;
  const compsRight = []; 
  const compsLeft  = []; 

  let m;
  while ((m = opNumRe.exec(s)) !== null) {
    const op = m[1];
    let threshold = parseFloat(m[2]);

    const opIndex = m.index;
    if (opIndex > fracInS) {
      compsRight.push({ op, threshold });
    } else {
      const invert = (o) => {
        switch (o) {
          case '<':  return '>';
          case '<=': return '>=';
          case '>':  return '<';
          case '>=': return '<=';
          case '=':
          case '==': return '==';
          case '!=':
          case '<>': return '!=';
          default:   return o;
        }
      };
      compsLeft.push({ op: invert(op), threshold });
    }
  }

  const comparisons = [...compsLeft, ...compsRight];
  if (comparisons.length === 0) return null;

  return { numeratorCol, denominatorCol, isAverage, comparisons };
}

function buildExistsSQL(table, numCol, denCol, op) {
  const base = `FROM \`${table}\` WHERE \`${denCol}\` IS NOT NULL AND \`${denCol}\` <> 0`;
  switch (op) {
    case '>':
      return { sql: `SELECT 1 ${base} AND (\`${numCol}\`/\`${denCol}\`) > ? LIMIT 1`, params: ['value'] };
    case '>=':
      return { sql: `SELECT 1 ${base} AND (\`${numCol}\`/\`${denCol}\`) >= ? LIMIT 1`, params: ['value'] };
    case '<':
      return { sql: `SELECT 1 ${base} AND (\`${numCol}\`/\`${denCol}\`) < ? LIMIT 1`, params: ['value'] };
    case '<=':
      return { sql: `SELECT 1 ${base} AND (\`${numCol}\`/\`${denCol}\`) <= ? LIMIT 1`, params: ['value'] };
    case '=':
    case '==':
      return {
        sql: `SELECT 1 ${base} AND ABS((\`${numCol}\`/\`${denCol}\`) - ?) < ? LIMIT 1`,
        params: ['value', 'eps']
      };
    case '!=':
    case '<>':
      return {
        sql: `SELECT 1 ${base} AND ABS((\`${numCol}\`/\`${denCol}\`) - ?) >= ? LIMIT 1`,
        params: ['value', 'eps']
      };
    default:
      return null;
  }
}

module.exports = (app) => {
  app.post('/calculate-result', (req, res) => {
    
    const selectVD = `
      SELECT ID, PredicateID, SubPredicateText, SourceData
      FROM verification_data
      WHERE SubPredicateText IS NOT NULL
    `;

    connection.query(selectVD, async (err, rows) => {
      if (err) {
        console.error('Select verification_data error:', err);
        return res.status(500).json({ error: 'DB error selecting verification_data' });
      }

      const tasks = rows.map((row) => {
        const { ID, SubPredicateText, SourceData } = row;
        const parsed = parseSubPredicateText(SubPredicateText);

        if (!parsed) {
          console.warn(`Cannot parse SubPredicateText for ID=${ID}:`, SubPredicateText);
          return new Promise((resolve) => {
            connection.query(
              'UPDATE verification_data SET CalculatedResult = ? WHERE ID = ?',
              [null, ID], 
              () => resolve()
            );
          });
        }

        const { numeratorCol, denominatorCol, isAverage, comparisons } = parsed;
        const tableName = SourceData || DEFAULT_TABLE;

        if (isAverage) {
          const q = `
            SELECT AVG(CASE WHEN \`${denominatorCol}\` <> 0
                            THEN \`${numeratorCol}\` / \`${denominatorCol}\`
                            ELSE NULL END) AS value
            FROM \`${tableName}\`
          `;
          return new Promise((resolve) => {
            connection.query(q, (qErr, result) => {
              if (qErr) {
                console.error(`Query error for ID=${ID}:`, qErr);
                return connection.query(
                  'UPDATE verification_data SET CalculatedResult = ? WHERE ID = ?',
                  [null, ID],
                  () => resolve()
                );
              }
              const value = (result?.[0]?.value != null) ? Number(result[0].value) : null;
              let verdictVal = null;
              if (value != null) {
                const okAll = comparisons.every(({ op, threshold }) => {
                  switch (op) {
                    case '=':
                    case '==': return Math.abs(value - threshold) < EPS;
                    case '!=':
                    case '<>': return Math.abs(value - threshold) >= EPS;
                    case '>':  return value >  threshold;
                    case '>=': return value >= threshold;
                    case '<':  return value <  threshold;
                    case '<=': return value <= threshold;
                    default:   return false;
                  }
                });
                verdictVal = okAll ? 1 : 0;
              }
              connection.query(
                'UPDATE verification_data SET CalculatedResult = ? WHERE ID = ?',
                [verdictVal, ID],
                (uErr) => {
                  if (uErr) console.error(`Update error for ID=${ID}:`, uErr);
                  resolve();
                }
              );
            });
          });
        } else {
          const existsChecks = comparisons.map(({ op, threshold }) => {
            const built = buildExistsSQL(tableName, numeratorCol, denominatorCol, op);
            if (!built) return Promise.resolve(false);
            const { sql, params } = built;
            const values = params.map(p => {
              if (p === 'value') return threshold;
              if (p === 'eps') return EPS;
              return null;
            });

            return new Promise((resolve) => {
              connection.query(sql, values, (qErr, rows2) => {
                if (qErr) {
                  console.error(`EXISTS query error for ID=${ID}:`, qErr);
                  return resolve(false);
                }
                resolve(rows2 && rows2.length > 0);
              });
            });
          });

          return Promise.all(existsChecks).then((bools) => {
            const verdictVal = bools.every(Boolean) ? 1 : 0; 
            return new Promise((resolve) => {
              connection.query(
                'UPDATE verification_data SET CalculatedResult = ? WHERE ID = ?',
                [verdictVal, ID],
                (uErr) => {
                  if (uErr) console.error(`Update error for ID=${ID}:`, uErr);
                  resolve();
                }
              );
            });
          });
        }
      });
      
      Promise.all(tasks)
        .then(() => res.json({ message: 'CalculatedResult updated (row-wise ANY for non-Average).' }))
        .catch(() => res.status(500).json({ error: 'Unexpected error during calculation' }));
    });
  });
};
