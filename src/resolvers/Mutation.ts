import { userMutations } from './mutations/user-mutations'
import { postMutations } from './mutations/post-mutations'

export const Mutation = {
  ...userMutations  
  ...postMutations  

}