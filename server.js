const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const tagsRoutes = require('./routes/tags');
const { getUltimoTag, getLecturas } = require('./rfidReader');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/tags', tagsRoutes);

app.get('/api/ultimo-tag', (req, res) => {
  res.json({ tag: getUltimoTag() });
});

app.get('/api/lecturas', (req, res) => {
  res.json({ lecturas: getLecturas() });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
