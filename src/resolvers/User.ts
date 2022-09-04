import { Post, Profile } from "@prisma/client";
import { Context } from "..";

export const User = {
  posts: async ({ id }: any, _args: any, { prisma }: Context): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      where: { authorId: id }
    });

    return posts;
  },
  profile: async({ id }: any, _args: any, { prisma }: Context): Promise<Profile | null> => {
    const profile = await prisma.profile.findUnique({
      where: { userId: id }
    });

    return profile;
  }
}