var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('simpleBs4', { title: 'simpleBs4' });
});

module.exports = router;
