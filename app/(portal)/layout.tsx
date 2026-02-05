import React from 'react'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b h-14 flex items-center px-6 bg-card">
        <div className="font-bold text-lg flex items-center gap-2">
             DevCommand Portal
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
