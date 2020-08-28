const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const Post = require("./models/Post.js");
const { MONGODB } = require("./config.js");

const typeDefs = gql`
  type Post {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to database");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log(`Server is running on port ${res.url}`);
  });
