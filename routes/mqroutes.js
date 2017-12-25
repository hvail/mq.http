/***
 * 队列传送规则，内部WebHook系统使用
 * 将上传的信息记录到Redis中
 * Created by hvail on 2017/9/1.
 */
const express = require('express');
const redis = require('./../my_modules/redishelp');
const rabbit = require('./../my_modules/rabbit');
const router = express.Router();
const EXCHANGE_ROUTES_HASH = "mq.exchange.routes.hash";
const EXCHANGE_NAME = "hyz.server.webmq";
const TAG_QUEUE_ADD = "hyz.server.webmq.add";
const TAG_QUEUE_DEL = "hyz.server.webmq.del";
let channel;

let _connectionRabbit = function (cb) {
    rabbit.BuildChannel(function (err, ch) {
        if (err) return;
        cb && cb(ch);
    })
};

/* Bind Exchange Queue Route. */
function bindRoutes(req, res, next) {
    let data = req.body;
    let name = data.Name;
    let exchange = data.Exchange;
    let json = JSON.stringify(data);
    redis.HSET(EXCHANGE_ROUTES_HASH, exchange + "." + name, json);
    // 向rabbit发布一条信息
    _connectionRabbit(function (ch) {
        ch.publish(EXCHANGE_NAME, TAG_QUEUE_ADD, new Buffer(json));
    });
    res.send('1');
}

function delRoutes(req, res, next) {
    let data = req.query;
    let name = data.Name;
    let exchange = data.Exchange;
    redis.HDEL(EXCHANGE_ROUTES_HASH, exchange + "." + name);
    let queue = "mq-web." + exchange + "." + name;
    _connectionRabbit(function (ch) {
        ch.deleteQueue(queue);
    });
    res.send('1');
}

function getAll(req, res, next) {
    redis.HGETALL(EXCHANGE_ROUTES_HASH, function (err, result) {
        let data = [];
        if (result)
            for (let k in result) {
                data.push(JSON.parse(result[k]));
            }
        res.send(data);
    });
}

router.get("/", getAll);
router.post('/', bindRoutes);
router.delete("/", delRoutes);

module.exports = router;
