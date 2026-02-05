'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { format } from 'date-fns'

export default function PortalDashboard({ client, projects, invoices, code }: any) {
    const [activeTab, setActiveTab] = useState('projects')

    return (
        <div className="container mx-auto py-6 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {client.name}</h1>
                <p className="text-muted-foreground">Manage your projects and invoices</p>
            </div>

            <div className="flex space-x-1 rounded-xl bg-muted p-1 mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'projects' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    My Projects
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'invoices' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Invoices
                </button>
            </div>

            {activeTab === 'projects' && (
                <div className="grid gap-4">
                    {projects.length === 0 ? (
                        <p className="text-muted-foreground">No active projects.</p>
                    ) : (
                        projects.map((project: any) => (
                            <Card key={project.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        {project.name}
                                        <Badge>{project.status}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                                            <div key={status} className="bg-muted/50 p-3 rounded-lg">
                                                <h3 className="font-semibold mb-2 text-sm">{status.replace('_', ' ')}</h3>
                                                <div className="space-y-2">
                                                    {project.tasks.filter((t: any) => t.status === status).map((task: any) => (
                                                        <div key={task.id} className="bg-background p-2 rounded border text-sm shadow-sm">
                                                            {task.title}
                                                        </div>
                                                    ))}
                                                    {project.tasks.filter((t: any) => t.status === status).length === 0 && (
                                                        <p className="text-xs text-muted-foreground italic">No tasks</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'invoices' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invoices.length === 0 ? (
                            <p className="text-muted-foreground">No invoices found.</p>
                        ) : (
                            <div className="space-y-4">
                                {invoices.map((invoice: any) => (
                                    <div key={invoice.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                        <div>
                                            <p className="font-medium">#{invoice.number}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Due: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={invoice.status === 'PAID' ? 'default' : 'destructive'}>
                                                {invoice.status}
                                            </Badge>
                                            <p className="font-bold">
                                                {invoice.currency} {Number(invoice.totalAmount).toFixed(2)}
                                            </p>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/portal/${code}/invoice/${invoice.id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
