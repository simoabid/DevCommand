'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-user'
import { revalidatePath } from 'next/cache'

export async function logTime(projectId: string, durationMinutes: number, description?: string) {
    const user = await getCurrentUser()
    
    // Assume work finished now
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - durationMinutes * 60000)

    await prisma.timeLog.create({
        data: {
            userId: user.id,
            projectId,
            startTime,
            endTime,
            description,
        }
    })
    revalidatePath('/')
    revalidatePath('/invoices/new')
}

export async function startTimer(projectId: string, description?: string) {
    const user = await getCurrentUser()
    
    const active = await prisma.timeLog.findFirst({
        where: { userId: user.id, endTime: null }
    })
    
    if (active) throw new Error("Timer already running")
        
    await prisma.timeLog.create({
        data: {
            userId: user.id,
            projectId,
            startTime: new Date(),
            description
        }
    })
    revalidatePath('/')
}

export async function stopTimer() {
    const user = await getCurrentUser()
    const active = await prisma.timeLog.findFirst({
        where: { userId: user.id, endTime: null }
    })
    
    if (!active) throw new Error("No active timer")
        
    await prisma.timeLog.update({
        where: { id: active.id },
        data: { endTime: new Date() }
    })
    revalidatePath('/')
}

export async function getActiveTimer() {
    const user = await getCurrentUser()
    const timer = await prisma.timeLog.findFirst({
        where: { userId: user.id, endTime: null },
        include: { project: true }
    })
    return timer
}
