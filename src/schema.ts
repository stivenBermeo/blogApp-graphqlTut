import { gql} from 'apollo-server';


export const typeDefs = gql`
  type Query {
    postIndex: [Post!]!
    userIndex: [User!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(id: Int!, post: PostInput!): PostPayload!
    postDelete(id: Int!): Boolean!
    userCreate(user: UserInput): UserPayload!
    userUpdate(id: Int!, user: UserInput): UserPayload!
    profileCreate(profile: ProfileInput): ProfilePayload!
    profileUpdate(id: Int!, profile: ProfileInput): ProfilePayload!
    profileDelete(id: Int!): Boolean!

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

  type UserPayload {
    userErrors: [UserError!]!,
    user: User
  }

  input UserInput {
    name: String
    email: String
    password: String
  }

  type ProfilePayload {
    userErrors: [UserError!]!,
    profile: Profile
  }

  input ProfileInput {
    userId: Int
    bio: String
  }

  input PostInput {
    title: String
    content: String
  }
`;