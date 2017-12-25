/**
 * Created by hvail on 2017/9/1.
 */
const express = require('express');
const router = express.Router();
const rabbit = require('./../my_modules/rabbit');
const EXCHANGE = "hyz.program.command";
let channel;

let _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        channel = ch;
        cb && cb(ch);
    });
};

let _sendMsg = function (target, msg) {
    if (channel)
        channel.publish(EXCHANGE, EXCHANGE + "." + target, new Buffer(msg));
    else {
        _connectionRabbit(function (ch) {
            _sendMsg(target, msg);
        });
    }
};

let sendCommand = function (req, res, next) {
    let cmd = req.body;
    let msg = JSON.stringify(cmd);
    let target = cmd.Target;
    _sendMsg(target, msg);
    res.send("1");
};

/* GET users listing. */
router.get('/');
router.post('/', sendCommand);
router.delete('/:cmdId');

module.exports = router;

