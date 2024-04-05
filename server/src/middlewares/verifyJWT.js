const { TokenExpiredError } = require('jsonwebtoken');
const jwt = require('../lib/jwt');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {

        delete req.headers['Authorization'] || delete req.headers['authorization'];

        console.log('Token is missing!');

        return res.status(401).json({ message: 'Token is missing!' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, process.env.Access_Token_Secret);

        req.user = decoded.UserInfo; // req.user = {_id, username, email}

        next();
        
    } catch (error) {
        delete req.headers['Authorization'] || delete req.headers['authorization'];
        
        if (error.name === 'TokenExpiredError') {
            res.clearCookie(process.env.AUTH_COOKIE_NAME);

            return res.status(401).json({message: 'Token has expired!'});
        } else {
            console.log(error.name);
            console.log('Problem with token verification!');
            
            res.clearCookie(process.env.AUTH_COOKIE_NAME);

            return res.status(403).json({message: 'Problem with token verification!'});
        }
    }
};

module.exports = verifyJWT;