/***
 * 消息发送的主接口
 * Created by hvail on 2017/9/1.
 */
let express = require('express');
let router = express.Router();
let rabbit = require('./../my_modules/rabbit');
let channel;

let _DEFAULT_CLASS = {
    // 交换机名
    Exchange: "",
    // 消息tag
    MsgTag: "",
    // 数据内容
    Context: ""
};

let _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        channel = ch;
        cb && cb(ch);
    });
};

let _sendMsg = function (ch, ex, tag, msg) {
    ch.publish(ex, tag, new Buffer(msg));
};

let sendMessage = function (req, res, next) {
    let data = req.body;
    console.log(data);
    if (!channel)
        _connectionRabbit(function (_ch) {
            channel = _ch;
            _sendMsg(channel, data.Exchange, data.MsgTag, data.Context);
        });
    else
        _sendMsg(channel, data.Exchange, data.MsgTag, data.Context);
    res.send("1");
};

let buildExchange = function (req, res, next) {
    let data = req.body;
    console.log(data);
    rabbit.BuildExchange(data.ExChangeName);
    res.send("1");
};

/* GET users listing. */
router.post('/', sendMessage);
router.post('/ex', buildExchange);
module.exports = router;