import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { Errors } from "../../../utils/constants";
import { validateJWT } from "../../../utils/validateJWT";

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


export const postMutations = {
  postCreate: async (_parent: any, { post }: PostUpsertArgs, { prisma, authorization }: Context): Promise<PostPayloadType> => {
    const { title, content } = post;

    const JWT = validateJWT(authorization);
    if (!JWT) {
      return { ...Errors.authorizationInvalidToken, post: null };
    }

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
          authorId: JWT.userId
        }
      })
    };
  },
  postUpdate: async (_parent: any, { id, post }: { id: number, post: PostUpsertArgs['post'] }, { prisma, authorization }: Context): Promise<PostPayloadType> => {
    const { title, content } = post;

    const JWT = validateJWT(authorization);
    if (!JWT) {
      return { ...Errors.authorizationInvalidToken, post: null };
    }

    if (!title && !content) {
      return {
        userErrors: [{
          message: 'You must provide TITLE or CONTENT in order to update a post'
        }],
        post: null
      }
    }
    
    const targetPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!targetPost) {
      return {
        userErrors: [{
          message: 'Could not find requested post'
        }],
        post: null
      };
    }

    if (targetPost.authorId !== JWT.userId) {
      return { ...Errors.authorizationInvalidToken, post: null };
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
  postDelete: async(_parent: any, { id }: { id: number }, { prisma, authorization }: Context): Promise<Boolean> => {
    // TODO: Change boolean response for actual errors thing

    const JWT = validateJWT(authorization);
    if (!JWT) return false;
    
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post || post.authorId !== JWT.userId) return false;

    const response = await prisma.post.delete({
      where: { id }
    });

    return Boolean(response);
  },
}