const redis = require('redis');
const client = redis.createClient(6379);

client.on("connect", function () {
    console.log("redis connected");
    console.log(`connected `);
});

client.on("error", (err) => {
    console.log(err);
});

module.exports = client;