import { Context } from ".."


export const Query = {
  postIndex: async (_parent: any, _args: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      include: { author: true }
    });
    return posts;
  },

  userIndex: async (_parent: any, _args: any, { prisma }: Context) => {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });
    return users;
  }
}