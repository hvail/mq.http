var mq = require("amqplib/callback_api");
var _env = process.env;
var host = _env.MQ_RABBIT_HOST || "112.74.51.81",
    name = _env.MQ_RABBIT_NAME || "hvail",
    pwd = _env.MQ_RABBIT_PASSWORD || "hvail",
    URI = _env.MQ_URI || "amqp://hvail:hvail@112.74.51.81:5672?heartbeat=10&connection_timeout=10000";

var buildChannel = function (cb) {
    mq.connect(URI, function (err, conn) {
        if (err) {
            cb && cb(err);
            return;
        }
        conn.createChannel(function (err, ch) {
            cb && cb(err, ch);
        });
    });
}


var buildExchange = function (change, cb) {
    mq.connect(URI, function (err, conn) {
        if (err) {
            cb && cb(err);
            return;
        }
        conn.createChannel(function (err, ch) {
            ch.assertExchange(change, 'topic', {durable: false});
        });
    })
}

module.exports.BuildExchange = buildExchange;
module.exports.BuildChannel = buildChannel;

