import { ApolloServer} from 'apollo-server';
import { typeDefs } from './schema';
import * as resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url}) => {
  console.log(`Listening at ${url}`);
})