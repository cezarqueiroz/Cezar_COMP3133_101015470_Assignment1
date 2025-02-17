const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const userModel = require('./model/User');
const employeeModel = require('./model/Employee');

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
            created_at: String, 
            updated_at: String
        ): User
    }
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        created_at: String
        updated_at: String
    }
    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String
        updated_at: String
    }
`);

//Root resolver
const rootResolver = {
 
    signup: async (user) => {
        console.log(user);
        const { username, email, password } = user;
        const newUser = new userModel({
            username: username,
            email: email,
            password: password
        });
        const result = await newUser.save();
        return result;
    },

    Login: async () => {
        const user = await userModel.find({});
        return user;
      },
};

//GraphHTTP Object
const graphqlHttp = graphqlHTTP({
    schema: gqlSchema,
    rootValue: rootResolver,
    graphiql: true
    });

//Middleware
app.use('/graphql', graphqlHttp);

//Connect MongoDB
const connectDB = async() => {
    try{
        console.log('Connecting to MongoDB...');

        // const DB_NAME = 'graphql';
        // const DB_USER_NAME = 'admin';
        // const DB_USER_PASSWORD = 'admin';
        // const DB_CLUSTER = 'cluster0';
        const DB_CONNECTIO = 'mongodb+srv://101015470:m5tcfI5BimOJ25y6@cluster0.l53ef.mongodb.net/comp3133_101015470_assigment1?retryWrites=true&w=majority';

      mongoose.connect(DB_CONNECTIO, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(success => {
        console.log('Success Mongodb connection')
      }).catch(err => {
        console.log('Error Mongodb connection')
      });
    } catch(error) {
        console.log(`Unable to connect to DB : ${error.message}`);
      }
  }

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
  connectDB();
  console.log(`http://localhost:4000/graphql`);
});