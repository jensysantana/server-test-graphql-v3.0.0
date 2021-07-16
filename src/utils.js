const jwt = require('jsonwebtoken');
const APP_SECRET = '561161kjiugugisaw3some';

function getTokenPayload(token) {
    try {
        return jwt.verify(token, APP_SECRET);
    } catch (error) {
        console.log('error: ', error);

    }
}

function getUserId(req) {
    if (req) {

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '')
            if (!token) {
                throw new Error('No token found.')
            }
            const { user: userId } = getTokenPayload(token);
            // console.log('userIdMMMMMMMMMMMMM: ', userId);
            return userId;
        }
    } else {
        const { user: userId } = getTokenPayload(token);
        console.log('rest:XXXXXXXXXXXXXXXXXXXXXX ', userId);
        return userId;
    }
    throw new Error('Not authenticated');
}


module.exports = {
    APP_SECRET,
    getUserId
}