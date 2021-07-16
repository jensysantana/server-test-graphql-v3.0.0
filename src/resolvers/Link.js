function postedBy(parent, args, { prisma }) {
    return prisma.link.findUnique({ where: { id: parent.id } }).postedBy()
}

module.exports = {
    postedBy,
}