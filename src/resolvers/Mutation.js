const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');


async function signup(parent, args, { prisma }) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await prisma.user.create({
        data: { ...args, password }
    });

    const token = await jwt.sign({ user: user.id }, APP_SECRET);

    return {
        token,
        user
    }

}
async function sigin(parent, args, { prisma }) {

    const user = await prisma.user.findUnique({ where: { email: args.email } });
    if (!user) {
        throw new Error('No such user found.');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = await jwt.sign({ user: user.id }, APP_SECRET);

    return {
        token,
        user
    }
}

async function post(parent, args, { prisma, userId, pubsub }, info) {
    // console.log('userId: ', userId);
    // console.log('args: ', args);

    const newLink = await prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } },
        }
    });
    // pubsub.publish("NEW_LINK", newLink);
    pubsub.publish("NEW_LINK", newLink);
    return newLink;
}
module.exports = {
    post,
    signup,
    sigin
}