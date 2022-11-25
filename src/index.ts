import "dotenv/config";
import * as database from "./config/database.config";
import _ from "lodash";
import { ApolloServer, gql } from "apollo-server-express";
import { loadGraphqlResolver, loadGraphqlSchema } from "./helper/autoloader";
import { shield, rule, allow, deny, and, not, IRule } from "graphql-shield";
import jwt from "jsonwebtoken"
import { applyMiddleware, IMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";
import { permission } from "./helper/shield";
import express from 'express';
import { graphqlUploadExpress } from "graphql-upload-ts";
import cors from "cors";




const main = async () => {
    // connect to database
    await database.connect();

    //create typeDefs
    let typeDefs = [
        gql`
            scalar Mixed

            type Query{
                _empty: String
            }

            type Mutation {
                _empty: String
            }

            type Subscription {
                _empty: String
            }

            input QueryInput {
                "Số phần tử trên trang"
                limit: Int
                "Số trang"
                page: Int
                "Sắp xếp"
                order: Mixed
                "Bộ lọc"
                filter: Mixed
                "Tìm kiếm"
                search: String
            }

            type Pagination {
                "Tổng số phần tử"
                total: Int
                "Số phần tử trên trang"
                limit: Int
                "Số trang"
                page: Int
            }
        `
    ];



    //ceate resolvers
    let resolvers: any = {
        Query: {
            _empty: () => 'empty',
        },
    };

    // Load .schema.ts 
    const grapqlSchema = await loadGraphqlSchema();
    typeDefs = typeDefs.concat(grapqlSchema);

    // Load .resolver.ts
    const grapqlResolver = await loadGraphqlResolver();
    resolvers = _.merge(resolvers, grapqlResolver);

    const schema = applyMiddleware(
        makeExecutableSchema({
            typeDefs,
            resolvers
        }),
        shield(permission)
    )


    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        schema: schema,
        context: (req) => {
            user: {
                try {
                    const jwtToken = req.req.headers.authorization.split(" ")[1];
                    const token = jwt.verify(jwtToken, process.env.PRIVATE_KEY);
                    return token
                } catch (e) {
                    return null;
                }
            }
        }
    })
    await server.start();

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(graphqlUploadExpress());
    

    app.use(express.urlencoded({ extended: true }));

    server.applyMiddleware({ app });


    app.listen(process.env.PORT, () => {
        console.log(`App is running on port ${process.env.PORT}`);
        console.log(`Graphql EndPoint Path: ${server.graphqlPath}`);
    })
}
main();