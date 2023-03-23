const client = require('./../blacklist');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const { email, iat, exp } = await jwt.verify(token, process.env.JWT_SECRET);
        client.get(email, (err, data) => {
            if (err) throw err;
            if (data && data === token) {
                res.status(401).json({ message: 'current token no longer valid, please do sign in again' });
            }
            else next();
        });
    }
    catch (err) {
        res.status(401).json({ message: 'Auth failed!' });
    }
};
