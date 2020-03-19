const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    'INSERT INTO categories VALUES(DEFAULT, $1) RETURNING id,category_name',
    [userInput.category_name],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.get('/', function(req, res) {
  db.any(`SELECT * FROM categories`).then(data => {
    res.json(data);
  });
});

router.put('/:id', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    `UPDATE categories SET category_name=$1 WHERE id=${req.params.id} RETURNING id,category_name`,
    [userInput.category_name],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.delete('/:id', function(req, res) {
  db.one(
    `DELETE FROM categories WHERE id=${req.params.id} RETURNING id,category_name`,
    event => event
  ).then(data => {
    res.json(data);
  });
});

module.exports = router;
