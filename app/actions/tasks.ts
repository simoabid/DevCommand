'use server'

import { prisma } from '@/lib/prisma'
import { TaskStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getTasks(projectId: string) {
  return await prisma.task.findMany({
    where: { projectId },
    orderBy: { dueDate: 'asc' }, // Or any other sorting logic
  })
}

export async function createTask(data: {
  projectId: string
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: Date
}) {
  const task = await prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      status: data.status || 'TODO',
      dueDate: data.dueDate,
    },
  })

  revalidatePath(`/projects/${data.projectId}`)
  return task
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  })

  revalidatePath(`/projects/${task.projectId}`)
  return task
}
