const jwt = require('jsonwebtoken');

const validatejwt = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { phone, _id, username } = decoded;
        req.phone = phone;
        req._id = _id;
        req.username = username;
        next();
    } catch (err) {
        next('Authentication error!');
    }
};

module.exports = validatejwt;