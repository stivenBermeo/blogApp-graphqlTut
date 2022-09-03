import { User } from "@prisma/client";
import { Context } from "..";


export const Post = {
  author: async ({ authorId }: any, _args: any, { prisma }: Context): Promise<User | null>  => {
    const user = await prisma.user.findUnique({
      where: { id: authorId }
    });

    return user;
  }
}