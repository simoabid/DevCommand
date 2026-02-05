'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ProjectStatus } from '@prisma/client'

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientId: z.string().min(1, 'Client is required'),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
  budget: z.coerce.number().optional(),
  hourlyRate: z.coerce.number().optional(),
})

export type ProjectFormValues = z.infer<typeof ProjectSchema>

export async function getProjects() {
  // TODO: Add authentication check
  return await prisma.project.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getClients() {
    // TODO: Add authentication check
    return await prisma.client.findMany({
        orderBy: {
            name: 'asc'
        }
    })
}

export async function createProject(data: ProjectFormValues) {
  const validatedFields = ProjectSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  // TODO: Get actual logged in user
  const user = await prisma.user.findFirst()
  if (!user) {
    return { error: 'No user found (Seed the database first)' }
  }

  const { name, clientId, status, budget, hourlyRate } = validatedFields.data

  try {
    await prisma.project.create({
      data: {
        name,
        clientId,
        status,
        budget,
        hourlyRate,
        userId: user.id,
      },
    })
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Failed to create project:', error)
    return { error: 'Failed to create project' }
  }
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
    try {
        await prisma.project.update({
            where: { id },
            data: { status }
        })
        revalidatePath('/projects')
        return { success: true }
    } catch (error) {
        console.error('Failed to update status:', error)
        return { error: 'Failed to update status' }
    }
}
