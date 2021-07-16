
async function newLinkSubscribe(parent, args, { pubsub }, info) {
    return pubsub.asyncIterator('NEW_LINK')
}

const newLink = {
    subscribe: newLinkSubscribe,
    resolve: payload => {
        return payload;
    }
}

module.exports = {
    newLink
}