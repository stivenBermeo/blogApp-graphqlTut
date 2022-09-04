import { Post, Prisma, Profile, User } from "@prisma/client";
import { Context } from "../index";

interface UserUpsertArgs {
  user: {
    name: string
    email: string
    password: string
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
          authorId: 1
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


  userCreate: async (_parent: any, { user }: UserUpsertArgs, { prisma }: Context): Promise<UserPayloadType> => {
    const { name, email, password } = user;

    if (!email || !password) {
      return {
        userErrors: [{
          message: 'You must provide EMAIL and PASSWORD in order to create a user'
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
          password
        }
      })
    };
  },
  userUpdate: async (_parent: any, {id, user }: {id: number, user: UserUpsertArgs['user']}, { prisma }: Context): Promise<UserPayloadType> => {
    const { name, password } = user;

    if (!name && !password) {
      return {
        userErrors: [{
          message: 'You must provide Name or PASSWORD in order to update a user'
        }],
        user: null
      }
    }
    
    return {
      userErrors: [],
      user: prisma.user.update({
        where: { id },
        data: {
          name,
          password
        }
      })
    };
  },


  profileCreate: async (_parent: any, { profile }: ProfileUpsertArgs, { prisma }: Context): Promise<ProfilePayloadType> => {
    const { userId, bio } = profile;

    if (!userId || !bio) {
      return {
        userErrors: [{
          message: 'You must provide AUTHOR and BIO in order to create a profile'
        }],
        profile: null
      }
    }
    
    return {
      userErrors: [],
      profile: prisma.profile.create({
        data: {
          userId,
          bio
        }
      })
    };
  },

}