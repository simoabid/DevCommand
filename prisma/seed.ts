import 'dotenv/config'
import { PrismaClient, ProjectStatus } from '@prisma/client'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'demo@devcommand.com' },
    update: {},
    create: {
      email: 'demo@devcommand.com',
      name: 'Demo User',
      businessName: 'DevCommand Inc.',
    },
  })
  console.log(`Created user with id: ${user.id}`)

  // Create Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      userId: user.id,
      portalAccessCode: 'ACME123',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Globex Corporation',
      email: 'info@globex.com',
      userId: user.id,
      portalAccessCode: 'GLOBEX99',
    },
  })

  console.log(`Created clients: ${client1.name}, ${client2.name}`)

  // Create Projects
  const p1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      status: ProjectStatus.ACTIVE,
      budget: 5000,
      hourlyRate: 100,
      userId: user.id,
      clientId: client1.id,
    },
  })

  const p2 = await prisma.project.create({
    data: {
      name: 'Mobile App API',
      status: ProjectStatus.ACTIVE,
      budget: 12000,
      hourlyRate: 120,
      userId: user.id,
      clientId: client1.id,
    },
  })

  const p3 = await prisma.project.create({
    data: {
      name: 'Q4 Marketing Campaign',
      status: ProjectStatus.ON_HOLD,
      budget: 3000,
      userId: user.id,
      clientId: client2.id,
    },
  })

  console.log(`Created projects: ${p1.name}, ${p2.name}, ${p3.name}`)
  console.log('Seeding finished.')
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
