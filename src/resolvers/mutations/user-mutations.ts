import { Prisma, User } from "@prisma/client";
import { Context } from "../../index";
import Bcrypt from 'bcrypt';
import { BCRYPT_SALT, JWT_SIGNATURE } from "../../../utils/keys";
import JWT from 'jsonwebtoken';
import { Errors } from "../../../utils/constants";
import { validateJWT } from "../../../utils/validateJWT";
import { UserValidation } from '../../../utils/userValidation';


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

interface CredentialsArgs {
  user: {
    email: string;
    password: string;
  }
}
interface CredentialsPayloadType {
  userErrors: {
    message: string
  }[];
  token: string | null
}


export const userMutations = {
  userCreate: async (_parent: any, { user }: UserUpsertArgs, { prisma }: Context): Promise<CredentialsPayloadType> => {
    const { name, email, password, bio } = user;

    try {
      const userValidation = new UserValidation({ name, email, password, bio }, 'token');
      userValidation.create();
    } catch (err: any) {
      return err;
    }

    const hashedPassword = await Bcrypt.hash(password, BCRYPT_SALT);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio
          }
        }
      }
    });

    const token = JWT.sign({ userId: newUser.id }, JWT_SIGNATURE, { expiresIn: 3600000 });

    return {
      userErrors: [],
      token 
    };
  },
  userUpdate: async (_parent: any, {id, user }: {id: number, user: UserUpsertArgs['user']}, { prisma, authorization }: Context): Promise<UserPayloadType> => {
    const { name, password, bio } = user;

    const JWT = validateJWT(authorization);
    if (!JWT) {
      return { ...Errors.authorizationInvalidToken, user: null };
    }

    try {
      const userValidation = new UserValidation({ name, password, bio }, 'user');
      userValidation.create();
    } catch (err: any) {
      return err;
    }

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return { ...Errors.resourceNotFound, user: null }
    }

    if (JWT.userId !== targetUser.id) {
      return { ...Errors.authorizationInvalidToken, user: null };
    }
    
    const updateArg: any = {} ;

    if (name) updateArg.name = name;
    if (password) updateArg.password = await Bcrypt.hash(password, BCRYPT_SALT);
    if (bio) updateArg.profile = { update: { bio } };
    
    return {
      userErrors: [],
      user: prisma.user.update({
        where: { id },
        data: updateArg
      })
    };
  },
  userSignIn: async (_parent: any, { user }: CredentialsArgs, { prisma }: Context): Promise<CredentialsPayloadType> => {
    const { email, password } = user;

    if (!email) return Errors.credentialsInvalidInput;

    const userData = await prisma.user.findUnique({
      where: { email }
    });

    if (!userData) return Errors.credentialsInvalidInput;

    const isMatch = await Bcrypt.compare(password, userData.password);

    if (!isMatch) return Errors.credentialsInvalidInput;

    const token = JWT.sign({ userId: userData.id }, JWT_SIGNATURE, { expiresIn: 3600000 });

    return {
      userErrors: [],
      token 
    };

  },
  userDelete: async(_parent: any, { id }: { id: number }, { prisma, authorization }: Context): Promise<Boolean> => {
    // TODO: Change boolean response for actual errors thing

    const JWT = validateJWT(authorization);
    if (!JWT) return false;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user || user.id !== JWT.userId) return false;

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