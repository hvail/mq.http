const mq = require("amqplib/callback_api");
const _env = process.env;
const URI = _env.MQ_URI || "amqp://hvail:hvail@112.74.51.81:5672?heartbeat=10&connection_timeout=10000";
// URI = "amqp://hvail:hvail@112.74.51.81:5672?heartbeat=10&connection_timeout=10000";

console.log(URI);
let buildChannel = function (cb) {
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


let buildExchange = function (change, cb) {
    // console.log(URI);
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

