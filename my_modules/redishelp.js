let redis_host = process.env.REDIS_HOST || "119.23.27.9";
// let redis_pwd = process.env.REDIS_PASSWORD || "892df215f8684736:HvailCom2015";
let redis_pwd = process.env.REDIS_PASSWORD || "HvailCom2015HYZ";
redis_pwd = "892df215f8684736:HvailCom2015";
let redis_port = process.env.REDIS_PORT || 6379;
const redis = require('redis');
let redisClient;
let isConnection = false;

redisClient = redis.createClient(redis_port, redis_host, {});
redisClient.auth(redis_pwd);
redisClient.on('ready', function (res) {
    redisClient.on('connect', function () {
        isConnection = true;
    });
});

module.exports = redisClient;