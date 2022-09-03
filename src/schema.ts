import { gql} from 'apollo-server';


export const typeDefs = gql`
  type Query {
    postIndex: [Post!]!
    userIndex: [User!]!
  }

  type Mutation {
    postCreate(title: String!, content: String!): PostPayload!
  }

  type User {
    id: ID!
    name: String
    email: String!
    profile: Profile
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    author: User
  }

  type Profile {
    id: ID!
    user: User!
    bio: String!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!,
    post: Post
  }
`;