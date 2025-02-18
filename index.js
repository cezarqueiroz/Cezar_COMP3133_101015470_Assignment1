const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('./model/User');
const employeeModel = require('./model/Employee');

const app = express();
const SERVER_PORT = 4000;

// GraphQL Schema
const gqlSchema = buildSchema(`
    type Query {
        login(email: String!, password: String!): String
        getAllEmployees: [Employee]
        getEmployeeById(id: ID!): Employee
        searchEmployee(designation: String, department: String): [Employee]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): User
        addEmployee(
            first_name: String!,
            last_name: String!,
            email: String!,
            gender: String,
            designation: String!,
            salary: Float!,
            date_of_joining: String!,
            department: String!,
            employee_photo: String
        ): Employee
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, designation: String, salary: Float, department: String, employee_photo: String): Employee
        deleteEmployee(id: ID!): String
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

// Resolvers root
const rootResolver = {
    // Uer Registration
    signup: async ({ username, email, password }) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ username, email, password: hashedPassword });
            return await newUser.save();
        } catch (error) {
            throw new Error('Signup failed');
        }
    },

    // Use Login
    login: async ({ email, password }) => {
        try {
            console.log('Login and PASS');
            console.log(email, password);
            const user = await userModel.findOne({ email });
            console.log('This USER');
            console.log(user);
            console.log(await userModel.find());

            if (!user) throw new Error('User not found');
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw new Error('Invalid credentials');

            return "Log in was successful";
        } catch (error) {
            throw new Error('Login failed');
        }
    },

    // Get All Employees
    getAllEmployees: async () => {
        return await employeeModel.find();
    },

    // Get Employee By ID
    getEmployeeById: async ({ id }) => {
        return await employeeModel.findById(id);
    },

    // Search Employee By Designation or Department
    searchEmployee: async ({ designation, department }) => {
        let query = {};
        if (designation) query.designation = designation;
        if (department) query.department = department;
        return await employeeModel.find(query);
    },

    // Add New Employee
    addEmployee: async (employeeInput) => {
        const newEmployee = new employeeModel(employeeInput);
        return await newEmployee.save();
    },

    // Update Employee By ID
    updateEmployee: async ({ id, ...updates }) => {
        return await employeeModel.findByIdAndUpdate(id, updates, { new: true });
    },

    // Delete Employee By ID
    deleteEmployee: async ({ id }) => {
        await employeeModel.findByIdAndDelete(id);
        return 'Employee deleted successfully';
    }
};

// iddleware
const graphqlHttp = graphqlHTTP({
    schema: gqlSchema,
    rootValue: rootResolver,
    graphiql: true
});

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


// Start Server
app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
    connectDB();
    console.log(`GraphQL Playground: http://localhost:${SERVER_PORT}/graphql`);
});
