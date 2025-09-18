const fs = require('fs');
const path = require('path');
const connection = require('./index');

const VALID_TAG_NAMES = new Set([
  'ontology', 'name', 'atom', 'atomDomain',
  'edge', 'from', 'to', 'predicate', 'concept'
]);

module.exports = (app) => {
  app.post('/prune-invalid-predicates', async (req, res) => {
    console.log('📩 /prune-invalid-predicates triggered');
    try {
      const [invalidPredicates] = await connection.promise().query(`
        SELECT StartTokenID, EndTokenID 
        FROM predicate 
        WHERE VerificationResult = 0
      `);

      const [allTokens] = await connection.promise().query(`
        SELECT ID, Text FROM tokens ORDER BY ID ASC
      `);

      for (const { StartTokenID, EndTokenID } of invalidPredicates) {
        if (StartTokenID !== null && EndTokenID !== null) {
          let toStartID = null;
          let toEndID = null;
          let fromStartID = null;
          let fromEndID = null;
          let edgeStartID = null;
          let edgeEndID = null;

          for (let j = allTokens.length - 1; j >= 0; j--) {
            const token = allTokens[j];
            if (token.ID >= StartTokenID) continue;

            const t = token.Text.trim();
            const next1 = allTokens[j + 1]?.Text?.trim();
            const next2 = allTokens[j + 2]?.Text?.trim();
            const next3 = allTokens[j + 3]?.Text?.trim();

            if (!toEndID && t === '<' && next1 === '/' && next2 === 'to' && next3 === '>') {
              console.log(`🔍 Found </to> at ID: ${token.ID}`);
              toEndID = token.ID;
              continue;
            }

            if (toEndID && !toStartID && t === '<' && next1 === 'to' && next2 === '>') {
              console.log(`🔍 Found <to> at ID: ${token.ID}`);
              toStartID = token.ID;
              continue;
            }

            if (!fromEndID && t === '<' && next1 === '/' && next2 === 'from' && next3 === '>') {
              console.log(`🔍 Found </from> at ID: ${token.ID}`);
              fromEndID = token.ID;
              continue;
            }

            if (fromEndID && !fromStartID && t === '<' && next1 === 'from' && next2 === '>') {
              console.log(`🔍 Found <from> at ID: ${token.ID}`);
              fromStartID = token.ID;
              continue;
            }

            if (!edgeStartID && t === '<' && next1 === 'edge') {
              console.log(`🔍 Found <edge> start at ID: ${token.ID}`);
              edgeStartID = token.ID;
              continue;
            }
          }

          for (let k = 0; k < allTokens.length; k++) {
            const token = allTokens[k];
            if (token.ID <= EndTokenID) continue;

            const t = token.Text.trim();
            const next1 = allTokens[k + 1]?.Text?.trim();
            const next2 = allTokens[k + 2]?.Text?.trim();
            const next3 = allTokens[k + 3]?.Text?.trim();

            if (!edgeEndID && t === '<' && next1 === '/' && next2 === 'edge' && next3 === '>') {
              console.log(`🔍 Found </edge> end at ID: ${token.ID}`);
              edgeEndID = token.ID + 3;
              break;
            }
          }

          if (edgeStartID !== null && edgeEndID !== null) {
            console.log('🧹 Removing <edge> block:', edgeStartID, '-', edgeEndID);
            await connection.promise().query(
              `DELETE FROM tokens WHERE ID BETWEEN ? AND ?`,
              [edgeStartID, edgeEndID]
            );
            continue; // skip rest if edge deleted
          }

          if (fromStartID !== null && fromEndID !== null && fromEndID > fromStartID) {
            console.log('✅ Removing <from> block:', fromStartID, '-', fromEndID + 3);
            await connection.promise().query(
              `DELETE FROM tokens WHERE ID BETWEEN ? AND ?`,
              [fromStartID, fromEndID + 3]
            );
          }

          if (toStartID !== null && toEndID !== null && toEndID > toStartID) {
            console.log('✅ Removing <to> block:', toStartID, '-', toEndID + 3);
            await connection.promise().query(
              `DELETE FROM tokens WHERE ID BETWEEN ? AND ?`,
              [toStartID, toEndID + 3]
            );
          }

          console.log('✅ Removing <predicate> block:', StartTokenID, '-', EndTokenID);
          await connection.promise().query(
            `DELETE FROM tokens WHERE ID BETWEEN ? AND ?`,
            [StartTokenID, EndTokenID]
          );
        }
      }

      const [tokens] = await connection.promise().query(`
        SELECT Text FROM tokens ORDER BY ID ASC
      `);

      let rawXml = '';
      let insidePredicate = false;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]?.Text?.trim();
        if (!token) continue;

        if (token === '<' && tokens[i + 1]?.Text?.trim() === 'predicate' && tokens[i + 2]?.Text?.trim() === '>') {
          insidePredicate = true;
          rawXml += '<predicate>';
          i += 2;
          continue;
        }

        if (
          token === '<' &&
          tokens[i + 1]?.Text?.trim() === '/' &&
          tokens[i + 2]?.Text?.trim() === 'predicate' &&
          tokens[i + 3]?.Text?.trim() === '>'
        ) {
          insidePredicate = false;
          rawXml += '</predicate>';
          i += 3;
          continue;
        }

        if (token === '<' && tokens[i + 1]?.Text?.trim() === 'concept') {
          let j = i + 2;
          let tagContent = 'concept';
          let isSelfClosing = false;

          while (j < tokens.length) {
            const t = tokens[j]?.Text?.trim();
            if (!t) break;
            if (t === '/') {
              isSelfClosing = true;
              j++;
              continue;
            }
            if (t === '>') break;
            tagContent += t;
            j++;
          }

          if (tokens[j]?.Text?.trim() === '>') {
            rawXml += isSelfClosing ? `<${tagContent}/>` : `<${tagContent}>`;
            i = j;
            continue;
          } else {
            rawXml += token;
            continue;
          }
        }

        if (token === '<') {
          let tagParts = [];
          let j = i + 1;

          while (j < tokens.length && tokens[j].Text?.trim() !== '>') {
            const part = tokens[j].Text?.trim();
            if (part) tagParts.push(part);
            j++;
          }

          if (tokens[j]?.Text?.trim() === '>') {
            const tagName = tagParts[0];
            if (tagName === 'edge') {
              rawXml += `<${tagName} ${tagParts.slice(1).join('')}>`;
            } else {
              rawXml += `<${tagParts.join('')}>`;
            }
            i = j;
            continue;
          } else {
            rawXml += token;
            continue;
          }
        }

        if (
          token === '<' &&
          tokens[i + 1]?.Text?.trim() === '/' &&
          VALID_TAG_NAMES.has(tokens[i + 2]?.Text?.trim()) &&
          tokens[i + 3]?.Text?.trim() === '>'
        ) {
          rawXml += `</${tokens[i + 2].Text.trim()}>`;
          i += 3;
          continue;
        }

        rawXml += token;
      }

      const outputPath = path.join(__dirname, 'final_output_zero_space.xml');
      fs.writeFileSync(outputPath, rawXml, 'utf-8');

      console.log('✅ XML rebuild completed. Output:', outputPath);

      res.json({
        message: '✅ XML rebuilt after pruning edge, predicate, to, and from blocks.',
        outputFile: outputPath
      });
    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({ error: 'Failed to rebuild XML' });
    }
  });
};
