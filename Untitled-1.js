const { ApolloServer } = require("apollo-server-express");
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-subscriptions');
import { createServer } from 'http';

import { makeExecutableSchema } from '@graphql-tools/schema';
import express from "express";
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core');
const typeDefs = require("./schema/graphqlSchema");
const { getUserId } = require("./utils");

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');

(async function () {
    const app = express();
    const httpServer = createServer(app);

    const resolvers = {
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
    await server.start()
    server.applyMiddleware({ app });
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })

})();
