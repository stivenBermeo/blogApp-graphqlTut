import { Post, Prisma, Profile, User } from "@prisma/client";
import { Context } from "../index";

interface UserUpsertArgs {
  user: {
    name: string
    email: string
    password: string
    bio: string
  }
}

interface UserPayloadType {
  userErrors: {
    message: string
  }[];
  user: User | Prisma.Prisma__UserClient<User> | null 
}

interface ProfileUpsertArgs {
  profile: {
    userId: number
    bio: string
  }
}

interface ProfilePayloadType {
  userErrors: {
    message: string
  }[];
  profile: Profile | Prisma.Prisma__ProfileClient<Profile> | null 
}

interface PostUpsertArgs {
  post: {
    title: string
    content: string
  }
}

interface PostPayloadType {
  userErrors: {
    message: string
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null 
}

export const Mutation = {

  postCreate: async (_parent: any, { post }: PostUpsertArgs, { prisma }: Context): Promise<PostPayloadType> => {
    const { title, content } = post;

    if (!title || !content) {
      return {
        userErrors: [{
          message: 'You must provide TITLE and CONTENT in order to create a post'
        }],
        post: null
      }
    }
    
    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: 2
        }
      })
    };
  },
  postUpdate: async (_parent: any, { id, post }: { id: number, post: PostUpsertArgs['post'] }, { prisma }: Context): Promise<PostPayloadType> => {
    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [{
          message: 'You must provide TITLE or CONTENT in order to update a post'
        }],
        post: null
      }
    }
    
    return {
      userErrors: [],
      post: prisma.post.update({
        where: { id },
        data: {
          title,
          content
        }
      })
    };
  },
  postDelete: async(_parent: any, { id }: { id: number }, { prisma }: Context): Promise<Boolean> => {
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) return false;

    const response = await prisma.post.delete({
      where: { id }
    });

    return Boolean(response);
  },

  userCreate: async (_parent: any, { user }: UserUpsertArgs, { prisma }: Context): Promise<UserPayloadType> => {
    const { name, email, password, bio } = user;

    if (!email || !password || !bio) {
      return {
        userErrors: [{
          message: 'You must provide EMAIL, BIO and PASSWORD in order to create a user'
        }],
        user: null
      }
    }
    
    return {
      userErrors: [],
      user: prisma.user.create({
        data: {
          name,
          email,
          password,
          profile: {
            create: {
              bio
            }
          }
        }
      })
    };
  },
  userUpdate: async (_parent: any, {id, user }: {id: number, user: UserUpsertArgs['user']}, { prisma }: Context): Promise<UserPayloadType> => {
    const { name, password, bio } = user;

    if (!name && !password && !bio) {
      return {
        userErrors: [{
          message: 'You must provide NAME, BIO or PASSWORD in order to update a user'
        }],
        user: null
      }
    }

    const updateArg: any = {} ;

    if (name) updateArg.name = name;
    if (password) updateArg.password = password;
    if (bio) updateArg.profile = { update: { bio } };
    
    return {
      userErrors: [],
      user: prisma.user.update({
        where: { id },
        data: updateArg
      })
    };
  },
  userDelete: async(_parent: any, { id }: { id: number }, { prisma }: Context): Promise<Boolean> => {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) return false;

    const response =  await prisma.$transaction(async (prisma) => {
      const hasPosts = await prisma.post.findMany({
        where: { authorId: id }
      });
      if (hasPosts) {
        await prisma.post.deleteMany({
          where: { authorId: id }
        })
      }
  
      const hasProfile = await prisma.profile.findUnique({
        where: { userId: id }
      });
      if (hasProfile) {
        await prisma.profile.delete({
          where: { userId: id }
        })
      }

      return prisma.user.delete({
        where: { id }
      })
    }).catch( err => {
      return false;
    });

    return Boolean(response);
  },

}