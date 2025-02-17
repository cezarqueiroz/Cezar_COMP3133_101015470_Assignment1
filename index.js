const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const app = express();
const SERVER_PORT = 4000;

//Schema
const gqlSchema = buildSchema(`
    type Query {
        welcome: String
        user: User
        users: [User]
    }
    type Mutation {
        signup(
            username: String!, 
            email: String!, 
            password: String!, 
            created_at: Date, 
            updated_at: Date
        ): User
    }
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        created_at: Date
        updated_at: Date
    }
`);

//Root resolver
const rootResolver = {
  welcome: () => {
    return 'Welcome to GraphQL';
  },
  Login: () => {
    return 'Login Successfully';
  },
//   GetAllEmployees: () => {
//     return [
//       { id: 1, name: 'John', age: 30 },
//       { id: 2, name: 'Doe', age: 25 },
//     ];
//   },
//   SearchEmployeeById: (args) => {
//     const id = args.id;
//     const employees = [
//       { id: 1, name: 'John', age: 30 },
//       { id: 2, name: 'Doe', age: 25 },
//     ];
//     return employees.find((employee) => employee.id === id);
//   },
//   createPost: (args) => {
//     const title = args.title;
//     const content = args.content;
//     return { title, content };
//   },
};

//GraphHTTP Object
const graphqlHttp = graphqlHTTP({
    schema: gqlSchema,
    rootValue: rootResolver,
    graphiql: true
    });

//Middleware
app.use('/graphql', graphqlHttp);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
  console.log(`http://localhost:4000/graphql`);
});