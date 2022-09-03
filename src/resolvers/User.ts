import { Post } from "@prisma/client";
import { Context } from "..";

export const User = {
  posts: async ({ id }: any, _args: any, { prisma }: Context): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      where: { authorId: id }
    });

    return posts;
  }
}