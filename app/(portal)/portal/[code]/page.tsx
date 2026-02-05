import { getClientByAccessCode, getPortalData } from '@/app/actions/portal'
import { notFound } from 'next/navigation'
import PortalDashboard from './dashboard'

export default async function PortalPage({ params }: { params: { code: string } }) {
    const { code } = await params
    const client = await getClientByAccessCode(code)
    if (!client) return notFound()

    const data = await getPortalData(client.id)
    if (!data) return <div>Error loading data</div>

    return <PortalDashboard client={client} projects={data.projects} invoices={data.invoices} code={code} />
}
