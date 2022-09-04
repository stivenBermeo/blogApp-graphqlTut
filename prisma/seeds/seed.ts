import { PrismaClient } from '@prisma/client'

const mockUsers = require('./mockData/users.json');
const mockPosts = require('./mockData/posts.json');
const mockProfiles = require('./mockData/profiles.json');

const prisma = new PrismaClient()

async function main() {
  
  await prisma.user.createMany({ data: mockUsers })
  await prisma.post.createMany({ data: mockPosts })
  await prisma.profile.createMany({ data: mockProfiles })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })