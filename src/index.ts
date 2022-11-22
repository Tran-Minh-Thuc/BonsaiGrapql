import "dotenv/config";
import * as database from "./config/database.config";
import _ from "lodash";
import { ApolloServer, gql } from "apollo-server";
import { loadGraphqlResolver, loadGraphqlSchema } from "./helper/autoloader";
import { shield, rule, allow, deny, and, not, IRule } from "graphql-shield";
import jwt from "jsonwebtoken"
import { applyMiddleware, IMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";
import { permission } from "./helper/shield";


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

    server.listen({ port: process.env.PORT }).then(({ url }) => {
        console.log(`[Info] server ready at ${url}`);
    })
}
main();