/***
 * 消息发送的主接口
 * Created by hvail on 2017/9/1.
 */
var express = require('express');
var router = express.Router();
var rabbit = require('./../my_modules/rabbit');
var channel;

var _DEFAULT_CLASS = {
    // 交换机名
    Exchange: "",
    // 消息tag
    MsgTag: "",
    // 数据内容
    Context: ""
}

var _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        channel = ch;
        cb && cb(ch);
    });
}

var _sendMsg = function (ch, ex, tag, msg) {
    ch.publish(ex, tag, new Buffer(msg));
}

var sendMessage = function (req, res, next) {
    var data = req.body;
    if (!channel)
        _connectionRabbit(function (_ch) {
            channel = _ch;
            _sendMsg(channel, data.Exchange, data.MsgTag, data.Context);
        });
    else
        _sendMsg(channel, data.Exchange, data.MsgTag, data.Context);
    res.send("1");
}

/* GET users listing. */
router.post('/', sendMessage);
module.exports = router;