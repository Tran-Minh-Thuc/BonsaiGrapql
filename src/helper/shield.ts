import { shield, rule, allow, deny, and, not, IRule } from "graphql-shield";



let isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return false;
})



export const permission = {
    Query: {
        //getAllUsers: isAuthenticated
    },
    // Mutation:{
    //     login:allow
    // }
}

