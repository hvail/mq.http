/**
 * Created by hvail on 2017/9/1.
 */

var express = require('express');
var router = express.Router();
const EXCHANGE = "hyz.program.command";
var channel;

var _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        channel = ch;
        cb && cb(ch);
    })
}

var _sendMsg = function (target, msg) {
    if (channel)
        channel.publish(EXCHANGE, EXCHANGE + "." + target, new Buffer(msg));
    else {
        _connectionRabbit(function (ch) {
            _sendMsg(target, msg);
        });
    }
}

var sendCommand = function (req, res, next) {
    var cmd = req.body;
    var msg = JSON.stringify(cmd);
    var target = cmd.Target;
    _sendMsg(target, msg);
    res.send("1");
}

/* GET users listing. */
router.get('/');
router.post('/', sendCommand);
router.delete('/:cmdId');

module.exports = router;
