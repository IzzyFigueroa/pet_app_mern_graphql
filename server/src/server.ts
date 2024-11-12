import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import connection from './config/connection.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';


const app = express();
const PORT = process.env.PORT || 3333;





const server = new ApolloServer({
    typeDefs,
    resolvers,
});


connection.once('open', async () => {
await server.start();

//Middleware
// Allows json to the attached to req.body in our routes.
app.use(
    '/graphql',
    express.json(),
    // Allow the resolvers to access client-sde cookies though context.req.cookies
    cookieParser(),
    expressMiddleware(server, {
        // Attach the contect object for all resolvers - The return value of the function is what your context will be
        context: async ({ req, res }) => {
            return {
                req: req,
                res: res
            };
        }
    }),
);


    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    });
});