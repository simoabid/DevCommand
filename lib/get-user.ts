import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devcommand.com' }
  })
  
  if (!user) {
    // Fallback for development if seed didn't run
    return await prisma.user.create({
      data: {
        email: 'demo@devcommand.com',
        name: 'Demo User',
        businessName: 'DevCommand Inc.'
      }
    })
  }
  
  return user
}
