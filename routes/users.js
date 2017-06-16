var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('error', { title: 'My Eng App' });
});

module.exports = router;
