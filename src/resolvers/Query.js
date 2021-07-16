
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { APP_SECRET } = require('../utils');

async function feed(parent, args, context) {
    return context.prisma.link.findMany();
}
function info() {
    return 'Santana Jensy Info'
}


module.exports = {
    feed,
    info
}