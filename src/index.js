const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-subscriptions');
import { createServer } from 'http';
// import { execute, subscribe } from 'graphql';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from "express";
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');
// const { feed } = require("./resolvers/Query");
const typeDefs = require("./schema/graphqlSchema");
const { getUserId } = require("./utils");
// const { post, signup, sigin } = require("./resolvers/Mutation");

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');

// let links = [
//     {
//         id: 'link-0',
//         url: 'www.claford.com',
//         description: 'Fullstack tutorial for GraphQL'
//     }
// ];
(async function () {
    const app = express();
    const httpServer = createServer(app);

    const resolvers = {
        // Query: {
        //     info: () => null,
        //     feed: feed,
        // },
        // Link: {
        //     id: parent => parent.id,
        //     url: parent => parent.url,
        //     description: parent => parent.description,
        // },
        // User,
        // Mutation: {
        //     post: post,
        //     signup: signup,
        //     sigin: sigin
        // }

        Query,
        Mutation,
        Subscription,
        User,
        Link,
    }
    const pubsub = new PubSub();
    const prisma = new PrismaClient();

    const schema = new makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
        schema,
        // typeDefs: [typeDefs],
        // resolvers: [resolvers],
        // cors: CorsOptions,
        // subscriptions: {
        //     onConnect: async (connectionParams, webSocket) => {
        //         console.log('xxx');
        //         console.log(connectionParams);
        //     },
        // },
        // playground: {
        //     subscriptionEndpoint: 'ws://localhost:4000/graphql'
        // },
        subscriptions: {
            path: '/graphql',

            keepAlive: 9000,
            onConnect: (connParams, webSocket, context) => {
                console.log('CLIENT CONNECTED');
            },
            onDisconnect: (webSocket, context) => {
                console.log('CLIENT DISCONNECTED')
            }
        },
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(
                {
                    'some.setting': true,
                    'general.betaUpdates': false,
                    'editor.theme': 'dark',//as Theme
                    'editor.cursorShape': 'line',// as CursorShape
                    'editor.reuseHeaders': true,
                    'tracing.hideTracingResponse': true,
                    'queryPlan.hideQueryPlanResponse': true,
                    'editor.fontSize': 14,
                    'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
                    'request.credentials': 'omit',
                }
            ),
            // process.env.NODE_ENV === 'production'
            //     ? ApolloServerPluginLandingPageDisabled()
            //     : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        context: ({ req }) => {
            return {
                ...req,
                prisma,
                pubsub,
                userId: req && req.headers.authorization ? getUserId(req) : null
            }
        }
    });

    const PORT = 4000;
    // server.listen({ port }, () => {
    //     console.log(
    //         `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
    //     );
    //     console.log(
    //         `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
    //     );
    // })

    // httpServer.listen(PORT, () => {
    //     console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    //     console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    // })

    const serverxx = new ApolloServer({
        schema,
        subscriptions: {
            path: '/graphql',

            keepAlive: 9000,
            onConnect: (connParams, webSocket, context) => {
                console.log('CLIENT CONNECTED');
            },
            onDisconnect: (webSocket, context) => {
                console.log('CLIENT DISCONNECTED')
            }
        },
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(
                {
                    'some.setting': true,
                    'general.betaUpdates': false,
                    'editor.theme': 'dark',//as Theme
                    'editor.cursorShape': 'line',// as CursorShape
                    'editor.reuseHeaders': true,
                    'tracing.hideTracingResponse': true,
                    'queryPlan.hideQueryPlanResponse': true,
                    'editor.fontSize': 14,
                    'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
                    'request.credentials': 'omit',
                }
            ),
            // process.env.NODE_ENV === 'production'
            //     ? ApolloServerPluginLandingPageDisabled()
            //     : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        context: ({ req }) => {
            return {
                ...req,
                prisma,
                pubsub,
                userId: req && req.headers.authorization ? getUserId(req) : null
            }
        }
    })

    serverxx.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`)
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
    // .then(({ url }) => console.log(`Server is running on ${url}`)).catch(err => console.log('error server', err))

})();
