//Dependencies
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

//Files
const typeDefs = require("./graphql/typeDefs");
const { MONGODB } = require("./config.js");
const resolvers = require("./graphql/resolvers");

//Creating Server
const server = new ApolloServer({ typeDefs, resolvers });

//Connecting Database
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to database");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log(`Server is running on port ${res.url}`);
  });
