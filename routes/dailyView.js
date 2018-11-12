var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('dailyView', { title: 'dailyView' });
});

module.exports = router;
