/***
 * 队列消息
 * 将上传的信息记录到Redis中
 * Created by hvail on 2017/9/1.
 */
var express = require('express');
var redis = require('./../my_modules/redishelp');
var rabbit = require('./../my_modules/rabbit');
var router = express.Router();
const EXCHANGE_ROUTES_HASH = "mq.exchange.routes.hash";
const EXCHANGE_NAME = "hyz.server.webmq";
const TAG_QUEUE_ADD = "hyz.server.webmq.add";
const TAG_QUEUE_DEL = "hyz.server.webmq.del";
var channel;

var _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        if (err) return;
        cb && cb(ch);
    })
}

/* Bind Exchange Queue Route. */
function bindRoutes(req, res, next) {
    var data = req.body;
    var name = data.Name;
    var exchange = data.Exchange;
    var json = JSON.stringify(data);
    redis.HSET(EXCHANGE_ROUTES_HASH, exchange + "." + name, json);
    // 向rabbit发布一条信息
    _connectionRabbit(function (ch) {
        ch.publish(EXCHANGE_NAME, TAG_QUEUE_ADD, new Buffer(json));
    });
    res.send('1');
}

function delRoutes(req, res, next) {
    var data = req.query;
    var name = data.Name;
    var exchange = data.Exchange;
    redis.HDEL(EXCHANGE_ROUTES_HASH, exchange + "." + name);
    var queue = exchange + ".mq-web." + name;
    _connectionRabbit(function (ch) {
        ch.deleteQueue(queue);
    });
    res.send('1');
}

function getAll(req, res, next) {
    redis.HGETALL(EXCHANGE_ROUTES_HASH, function (err, result) {
        var data = [];
        if (result)
            for (var k in result) {
                data.push(JSON.parse(result[k]));
            }
        res.send(data);
    });
}

router.get("/", getAll);
router.post('/', bindRoutes);
router.delete("/", delRoutes);

module.exports = router;
