const express = require('express');
const router = express.Router();

let version = 'v2.0.0';
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send(version);
});

module.exports = router;
