const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Register routes
require('./routes/saveToken')(app);
require('./routes/extractPredicate')(app);
require('./routes/splitPredicate')(app);
require('./routes/calcResult')(app);
require('./routes/saveSource')(app);
require('./routes/finalizePredicate')(app);
require('./routes/rebuildXML')(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
