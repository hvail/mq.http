var sendData = function (req, cb) {
    var body = '', obj;
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        //读取参数流结束后将转化的body字符串解析成 JSON 格式
        try {
            if (!body) {
                cb && cb(null, {});
                return;
            }
            obj = JSON.parse(body);
        } catch (err) {
            obj = null;
            cb && cb(err);
            console.log("未知的JSON格式数据");
            // eb && eb("未知的JSON格式数据");
            return;
        }
        cb && cb(null, obj);
    });
}

var handlerPost = function (req, res, cb) {
    sendData(req, function (err, data) {
        if (err) {
            res.status(412).send(err);
        } else {
            cb && cb(data);
        }
    });
}

module.exports.PostData = sendData;
module.exports.HandlerPost = handlerPost;

