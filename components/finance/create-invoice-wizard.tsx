"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getClients } from "@/app/actions/projects"
import { getUnbilledTimeLogs, createInvoice } from "@/app/actions/invoicing"
import { Loader2 } from "lucide-react"

export function CreateInvoiceWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [clients, setClients] = useState<any[]>([])
    const [selectedClientId, setSelectedClientId] = useState("")
    const [timeLogs, setTimeLogs] = useState<any[]>([])
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        getClients().then(setClients)
    }, [])

    const handleClientSelect = async (clientId: string) => {
        setSelectedClientId(clientId)
        setLoading(true)
        try {
            const logs = await getUnbilledTimeLogs(clientId)
            setTimeLogs(logs)
            setSelectedLogIds(logs.map(l => l.id)) // Default select all
            setStep(2)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (selectedLogIds.length === 0) return
        setCreating(true)
        try {
            const invoice = await createInvoice(selectedClientId, selectedLogIds)
            router.push(`/invoices/${invoice.id}`)
        } catch (e) {
            console.error(e)
            alert("Failed to create invoice")
            setCreating(false)
        }
    }

    // Step 1: Select Client
    if (step === 1) {
        return (
            <Card className="w-full max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Create Invoice - Step 1: Select Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Client</Label>
                            <Select onValueChange={handleClientSelect} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={loading ? "Loading logs..." : "Select client..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Step 2: Select Time Logs
    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Create Invoice - Step 2: Select Time Logs</CardTitle>
            </CardHeader>
            <CardContent>
                {timeLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No unbilled time logs found for this client.
                    </div>
                ) : (
                    <div className="space-y-2">
                         {timeLogs.map(log => (
                            <div key={log.id} className="flex items-center space-x-2 border p-3 rounded-md">
                                <Checkbox 
                                    id={log.id} 
                                    checked={selectedLogIds.includes(log.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) setSelectedLogIds([...selectedLogIds, log.id])
                                        else setSelectedLogIds(selectedLogIds.filter(id => id !== log.id))
                                    }}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={log.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {log.project.name} - {log.description || 'No description'}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(log.startTime).toLocaleDateString()} • {((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 3600000).toFixed(2)} hrs
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} disabled={creating}>Back</Button>
                <Button onClick={handleCreate} disabled={selectedLogIds.length === 0 || creating}>
                    {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Generate Invoice
                </Button>
            </CardFooter>
        </Card>
    )
}
