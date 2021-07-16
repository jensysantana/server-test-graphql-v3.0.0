const typeDefs = `
    type Query {
        info:String!
        users:[User!]!
        user(_id:ID!): User
    }

    type Mutation {
        createUser(name: String!): User
    }
    type User {
        _id: ID!
        name: String
    }

`;

const resolvers = {
    Query: {
        info: () => null,
        users: () => {
            return [
                {
                    _id: '12',
                    name: 'Jensy A'
                },
                {
                    _id: '13',
                    name: 'Robocop card'
                },
                {
                    _id: '14',
                    name: 'People...'
                }
            ]
        },
        user: (parent, args) => {

            return {
                _id: args._id,
                name: args.name
            }
        }
    },
    Mutation: {
        createUser: (_, args) => {
            return {
                _id: '45252.',
                name: args.name
            }
        }
    }
}


// ✔ Your Prisma schema was created at prisma/schema.prisma
//   You can now open it in your favorite editor.

// Next steps:
// 1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
// 2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver (Preview) or mongodb (Preview).
// 3. Run prisma db pull to turn your database schema into a Prisma schema.
// 4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

// More information in our documentation:
// https://pris.ly/d/getting-started


// COURSE
// https://www.howtographql.com/graphql-js/4-adding-a-database/