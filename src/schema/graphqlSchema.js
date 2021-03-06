const { gql } = require('apollo-server-express');


const typeDefs = gql`
    type Query {
        info: String!
        feed: [Link!]!
    }

    type Mutation {
        post(url: String, description: String ):Link
        signup(email:String!, password:String!, name: String!): AuthPayload
        sigin(email:String!, password:String!): AuthPayload
    }
    
    type Subscription {
        newLink: Link
    }

    type Link {
        id: ID!
        description: String
        url: String,
        postedBy:User
    }

    type AuthPayload {
        token: String
        user:User
    }

    type User {
        id: ID
        name: String!
        email: String!
        links: [Link!]!
    }
`;

module.exports = typeDefs;