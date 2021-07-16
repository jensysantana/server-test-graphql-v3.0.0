function links(parent, args, { prisma }) {
    return prisma.user.findUnique({ where: { id: parent.id } }).links()
}

module.exports = {
    links,
}