const client = require('./../blacklist');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(`!!! token from req: ${token}`);
        client.get('token', (err, data) => {
            if (err) throw err;
            if (data && data === token) {
                // const blackedJwt = data;
                // console.log(data);
                // console.log('....from redis...', data);
                res.status(401).json({message: 'current token no longer valid, please do sign in again'})
                // next();
            }
            else{
                next();
            }
        });
    }
    catch (err) {
        res.status(401).json({ message: 'Auth failed!' });
    }

};