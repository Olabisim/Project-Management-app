const express = require('express')
const colors = require('colors')
const {graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
require('dotenv').config()
const port = process.env.PORT || 5000;
const connectDB = require('./config/db')
const app = express();

// Connect to database
connectDB();

app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, () => {
        console.log("server running on port: ", port)
})
