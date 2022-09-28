import { IMiddleware } from "graphql-middleware";
import { shield, rule, allow, deny, and, not, IRule } from "graphql-shield";
import { openStdin } from "process";
import { Mutation, Query } from "type-graphql";
import { getAllUsers } from "../modules/users/users.service";


const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    //authenticated
    return (ctx.userId == undefined && ctx.userId == null);

})
export const permission = {
    // Query:{
    //     getAllUsers : not(isAuthenticated)
    // },
    // Mutation:{
    //     login:allow
    // }
}