const redis = require('redis');

// Create a Redis client instance
const client = redis.createClient();

// Connect to the Redis server
client.on('connect', function() {
    console.log('Connected to Redis');
});

// Handle Redis connection errors
client.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = client;