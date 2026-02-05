'use client'

import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './pdf-template';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DownloadButton({ invoice, user, client }: { invoice: any, user: any, client: any }) {
    const [isClient, setIsClient] = useState(false)
    
    useEffect(() => {
        setIsClient(true)
    }, [])
    
    if (!isClient) return null

    return (
        <PDFDownloadLink document={<InvoicePDF invoice={invoice} user={user} client={client} />} fileName={`${invoice.number}.pdf`}>
            {({ blob, url, loading, error }) => (
                <Button disabled={loading}>
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    )
}
