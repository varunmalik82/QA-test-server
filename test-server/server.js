const express = require('express');
const app = express();
const port = process.env.API_PORT || 3000;
const cors = require('cors');
const apiRoutes = require('./routes');

app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);

const validateKey = (req, res, next) => {
  let keyHeader = req.header('x-api-key');
  if (keyHeader && keyHeader == 'testApiKey') {
    next();
  } else {
    res.status(401).send({ error: { code: 123, message: 'Invalid API key' } });
  }
};

app.get('/', validateKey, (req, res) => {
  res.status(200).send({ STATUS: 'Valid key' });
});

app.listen(port, function (err) {
  if (err) {
    console.error('Failure to launch api');
    return;
  }
  console.log(`Listening on port ${port}`);
});
