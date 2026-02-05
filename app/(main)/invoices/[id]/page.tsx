import { getInvoiceById } from "@/app/actions/invoicing"
import { getCurrentUser } from "@/lib/get-user"
import { DownloadButton } from "@/components/invoice/download-button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const invoice = await getInvoiceById(id)
    const user = await getCurrentUser()

    if (!invoice) return notFound()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Invoice {invoice.number}</h1>
                <DownloadButton invoice={invoice} user={user} client={invoice.client} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Client</h3>
                            <p>{invoice.client.name}</p>
                            <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-semibold">Summary</h3>
                            <p>Status: {invoice.status}</p>
                            <p>Total: {invoice.currency} {Number(invoice.totalAmount).toFixed(2)}</p>
                            <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">Line Items</h3>
                        <div className="space-y-2">
                             {Array.isArray(invoice.items) && invoice.items.map((item: any, i: number) => (
                                 <div key={i} className="flex justify-between text-sm">
                                     <span>{item.description} ({Number(item.quantity).toFixed(2)} hrs)</span>
                                     <span>{invoice.currency} {Number(item.amount).toFixed(2)}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
