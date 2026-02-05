'use server'

import { prisma } from '@/lib/prisma'

export async function getClientByAccessCode(code: string) {
  if (!code) return null
  
  try {
    const client = await prisma.client.findUnique({
      where: { portalAccessCode: code },
    })
    return client
  } catch (error) {
    console.error('Error fetching client by access code:', error)
    return null
  }
}

export async function getPortalData(clientId: string) {
  if (!clientId) return null

  try {
    const [projects, invoices, client] = await Promise.all([
      prisma.project.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
            tasks: true 
        }
      }),
      prisma.invoice.findMany({
        where: { clientId },
        orderBy: { issueDate: 'desc' },
      }),
      prisma.client.findUnique({
          where: { id: clientId }
      })
    ])

    return { projects, invoices, client }
  } catch (error) {
    console.error('Error fetching portal data:', error)
    return null
  }
}

export async function getPortalInvoice(invoiceId: string, code: string) {
    if (!invoiceId || !code) return null

    // First check if the code is valid
    const client = await prisma.client.findUnique({
        where: { portalAccessCode: code }
    })

    if (!client) return null

    // Then check if the invoice belongs to this client
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            clientId: client.id
        },
        include: {
            client: true,
            user: true
        }
    })

    return invoice
}
