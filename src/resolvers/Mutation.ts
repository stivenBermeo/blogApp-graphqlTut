import { Post, Prisma, User } from "@prisma/client";
import { Context } from "../index";

interface userUpsertArgs {
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


  userCreate: async (_parent: any, { user }: userUpsertArgs, { prisma }: Context): Promise<UserPayloadType> => {
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

}