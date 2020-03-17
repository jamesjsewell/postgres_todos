const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/router');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use('/api', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
