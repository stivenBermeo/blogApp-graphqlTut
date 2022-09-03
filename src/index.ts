import { ApolloServer} from 'apollo-server';
import { typeDefs } from './schema';
import * as resolvers from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>

}

const context = {
  prisma
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.listen().then(({ url}) => {
  console.log(`Listening at ${url}`);
})