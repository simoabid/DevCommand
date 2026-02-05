'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-user'
import { revalidatePath } from 'next/cache'
import { InvoiceStatus } from '@prisma/client'

export async function getInvoices() {
    const user = await getCurrentUser()
    return await prisma.invoice.findMany({
        where: { userId: user.id },
        include: { client: true },
        orderBy: { issueDate: 'desc' }
    })
}

export async function getInvoiceById(id: string) {
    const user = await getCurrentUser()
    return await prisma.invoice.findFirst({
        where: { id, userId: user.id },
        include: { client: true, timeLogs: { include: { project: true } } }
    })
}

export async function getUnbilledTimeLogs(clientId: string) {
    const user = await getCurrentUser()
    return await prisma.timeLog.findMany({
        where: {
            userId: user.id,
            project: { clientId },
            invoiceId: null,
            endTime: { not: null }, // Only completed logs
            billable: true
        },
        include: { project: true },
        orderBy: { startTime: 'asc' }
    })
}

export async function createInvoice(clientId: string, timeLogIds: string[]) {
    const user = await getCurrentUser()
    
    // Fetch logs to calculate total
    const logs = await prisma.timeLog.findMany({
        where: {
            id: { in: timeLogIds },
            userId: user.id,
            invoiceId: null
        },
        include: { project: true }
    })

    if (logs.length !== timeLogIds.length) {
        throw new Error("Some time logs are invalid or already billed")
    }

    let totalAmount = 0
    const items = []

    for (const log of logs) {
        if (!log.endTime) continue
        
        const durationHours = (log.endTime.getTime() - log.startTime.getTime()) / (1000 * 60 * 60)
        const rate = Number(log.project.hourlyRate) || 0 // Default to 0 if no rate
        const cost = durationHours * rate
        
        totalAmount += cost
        items.push({
            description: `${log.project.name} - ${log.description || 'Time Log'}`,
            quantity: Number(durationHours.toFixed(2)),
            price: rate,
            amount: Number(cost.toFixed(2))
        })
    }

    // Determine due date (e.g. 14 days)
    const issueDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Generate Invoice Number (Simple incremental or random for now)
    const count = await prisma.invoice.count({ where: { userId: user.id } })
    const number = `INV-${(count + 1).toString().padStart(4, '0')}`

    const invoice = await prisma.invoice.create({
        data: {
            userId: user.id,
            clientId,
            number,
            status: InvoiceStatus.DRAFT,
            issueDate,
            dueDate,
            currency: 'USD', // Hardcoded for now
            totalAmount: Number(totalAmount.toFixed(2)),
            taxAmount: 0, // Hardcoded
            items, // Json
            timeLogs: {
                connect: timeLogIds.map(id => ({ id }))
            }
        }
    })

    revalidatePath('/invoices')
    return invoice
}
