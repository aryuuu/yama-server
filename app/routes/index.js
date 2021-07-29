const express = require('express');
const app = express();

app.use((req, res, next) => {
  req.parent = {};
  next();
})

app.get('/_ping', (req, res) => {
  res.json({ timestamp: Date.now() });
});

app.use('/user', require('./user'));

app.all('*', (req, res) => {
  res.status(404).json({ message: 'not found' });
});

module.exports = app;
