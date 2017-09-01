var express = require('express');
var router = express.Router();

var version = 'v2.0.0';
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send(version);
});

module.exports = router;
