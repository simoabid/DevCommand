import { getInvoices } from "@/app/actions/invoicing"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function InvoicesPage() {
    const invoices = await getInvoices()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Invoices</h1>
                <Link href="/invoices/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> New Invoice
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {invoices.map(invoice => (
                    <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold">{invoice.number}</div>
                                    <div className="text-sm text-muted-foreground">{invoice.client.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">{invoice.currency} {Number(invoice.totalAmount).toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">{invoice.status}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {invoices.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No invoices found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
