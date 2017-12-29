/***
 * 消息发送的主接口
 * Created by hvail on 2017/9/1.
 */
let express = require('express');
let router = express.Router();
let rabbit = require('./../my_modules/rabbit');
let channel;
let exchangeMap = new Map();

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
        if (err) console.log(err);
        cb && cb(ch);
    });
};

let _sendMsg = function (ch, ex, tag, msg) {
    try {
        ch.checkExchange(ex, function (err, b, c) {
            if (err) {
                rabbit.BuildExchange(data.ExChangeName);
                // ch.assertExchange(ex, 'topic', {durable: false});
                console.log(err);
                console.log(JSON.stringify(err));
            } else {
                console.log(b);
                console.log(c);
                ch.publish(ex, tag, new Buffer(msg));
            }
        });
    } catch (e) {
        console.log(e);
    }
};

let sendMessage = function (req, res, next) {
    let data = req.body;
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
    rabbit.BuildExchange(data.ExChangeName);
    res.send("1");
};

/* GET users listing. */
router.post('/', sendMessage);
router.post('/ex', buildExchange);
module.exports = router;