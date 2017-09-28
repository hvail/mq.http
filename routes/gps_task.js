/**
 * Created by hvail on 2017/9/28.
 */
var express = require('express');
var router = express.Router();

var rabbit = require('./../my_modules/rabbit');
var http = require('./../my_modules/http');
var exchangeName = "hyz.program.task";
var exchangeDoneName = "hyz.program.taskdone";
var app;
var channel;

var buildChannel = function (cb) {
    rabbit.BuildChannel(exchangeName, function (err, ch) {
        if (err) {
            console.log(err);
            return;
        }
        cb && cb(ch);
    });
}

var sendMessage = function (target, msg, ex) {
    if (!channel) {
        buildChannel(function (ch) {
            channel = ch;
            console.log("push : " + ex + "." + target);
            channel.publish(ex, ex + "." + target, new Buffer(msg));
        })
    } else
        channel.publish(ex, ex + "." + target, new Buffer(msg));
}

var sendTask = function (req, res) {
    var cmd = req.body;
    var msg = JSON.stringify(cmd);
    var target = cmd.SerialNumber;
    sendMessage(target, msg, exchangeName);
    res.status(200).send("1");
}

var passTask = function (req, res) {
    var cmd = req.body;
    var msg = JSON.stringify(cmd);
    var target = cmd.SerialNumber;
    sendMessage(target, msg, exchangeDoneName);
    res.status(200).send("1");
}

var demo = function (req, res, next) {
    res.send("demo gps task");
}

// 这里是表决通过或失败修改
// var setTask = function (req, res) {
//     http.PostData(req, function (err, cmd) {
//         var msg = JSON.stringify(cmd);
//         var target = cmd.SerialNumber;
//         sendMessage(target, msg, exchangeDoneName);
//         res.status(200).send("1");
//     });
// }

// 任务启动
router.post('/', sendTask);
router.get('/', demo);
// 表决完成
router.post('/pass', passTask);

module.exports = router;


// var WebApplication = function (application) {
//     app = application;
// }
//
// WebApplication.prototype.start = function () {
//     console.log('GPSTask Start');
//     // 任务启动
//     app.post('/task', sendTask);
//     // 表决完成
//     app.post('/task/pass', passTask);
//     // app.put('/task', setTask);
//     // app.delete('/task/:CmdId');
//     return this;
// }
//
// module.exports = WebApplication;
