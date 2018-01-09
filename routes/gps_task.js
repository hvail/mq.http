/**
 * Created by hvail on 2017/9/28.
 */
const express = require('express');
const router = express.Router();

const rabbit = require('./../my_modules/rabbit');
const http = require('./../my_modules/http');
const exchangeName = "hyz.program.task";
const exchangeDoneName = "hyz.program.taskdone";
let app;
let channel;

let buildChannel = function (cb) {
    // rabbit.BuildChannel(exchangeName, function (err, ch) {
    rabbit.BuildChannel(function (err, ch) {
        if (err) {
            console.log(err);
            return;
        }
        cb && cb(ch);
    });
};

let sendMessage = function (target, msg, ex) {
    if (!channel) {
        buildChannel(function (ch) {
            channel = ch;
            console.log("push : " + ex + "." + target);
            channel.publish(ex, ex + "." + target, new Buffer(msg));
        })
    } else
        channel.publish(ex, ex + "." + target, new Buffer(msg));
};

let sendTask = function (req, res) {
    let cmd = req.body;
    let msg = JSON.stringify(cmd);
    let target = cmd.SerialNumber;
    sendMessage(target, msg, exchangeName);
    res.status(200).send("1");
};

let passTask = function (req, res) {
    let cmd = req.body;
    let msg = JSON.stringify(cmd);
    let target = cmd.SerialNumber;
    sendMessage(target, msg, exchangeDoneName);
    res.status(200).send("1");
};

let demo = function (req, res, next) {
    res.send("demo gps task");
};

// 这里是表决通过或失败修改
// let setTask = function (req, res) {
//     http.PostData(req, function (err, cmd) {
//         let msg = JSON.stringify(cmd);
//         let target = cmd.SerialNumber;
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


// let WebApplication = function (application) {
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
