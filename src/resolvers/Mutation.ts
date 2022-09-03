import { Post, Prisma } from "@prisma/client";
import { Context } from "../index";

interface PostCreateArgs {
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

  postCreate: async (_parent: any, { post }: PostCreateArgs, { prisma }: Context): Promise<PostPayloadType> => {
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

  postUpdate: async (_parent: any, { id, post }: { id: number, post: PostCreateArgs['post'] }, { prisma }: Context): Promise<PostPayloadType> => {
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


}