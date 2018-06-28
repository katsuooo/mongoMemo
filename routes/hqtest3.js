var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('hqtest3', { title: 'hqtest3' });
});

module.exports = router;
