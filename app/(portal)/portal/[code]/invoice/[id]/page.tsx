import { getPortalInvoice } from '@/app/actions/portal'
import { notFound } from 'next/navigation'
import { DownloadButton } from "@/components/invoice/download-button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default async function PortalInvoicePage({ params }: { params: { code: string, id: string } }) {
    const { code, id } = await params
    const invoice = await getPortalInvoice(id, code)

    if (!invoice) return notFound()

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0">
                    <Link href={`/portal/${code}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>
                <div className="flex justify-between items-center">
                     <div>
                        <h1 className="text-3xl font-bold">Invoice {invoice.number}</h1>
                        <Badge variant={invoice.status === 'PAID' ? 'default' : 'destructive'} className="mt-2">
                            {invoice.status}
                        </Badge>
                     </div>
                     <DownloadButton invoice={invoice} user={invoice.user} client={invoice.client} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-1">From</h3>
                            <p className="font-medium">{invoice.user.businessName || invoice.user.name}</p>
                            <p className="text-sm">{invoice.user.email}</p>
                        </div>
                        <div className="text-right">
                             <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-1">Bill To</h3>
                             <p className="font-medium">{invoice.client.name}</p>
                             <p className="text-sm">{invoice.client.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                             <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-1">Dates</h3>
                             <p className="text-sm"><span className="font-medium">Issued:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                             <p className="text-sm"><span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                         <div className="text-right">
                             <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-1">Amount Due</h3>
                             <p className="text-2xl font-bold">{invoice.currency} {Number(invoice.totalAmount).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Items</h3>
                        <div className="space-y-3">
                             {Array.isArray(invoice.items) && invoice.items.map((item: any, i: number) => (
                                 <div key={i} className="flex justify-between text-sm items-center">
                                     <div>
                                        <p className="font-medium">{item.description}</p>
                                        <p className="text-muted-foreground">{Number(item.quantity).toFixed(2)} hrs @ {item.price}/hr</p>
                                     </div>
                                     <span className="font-medium">{invoice.currency} {Number(item.amount).toFixed(2)}</span>
                                 </div>
                             ))}
                        </div>
                         <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>{invoice.currency} {Number(invoice.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
