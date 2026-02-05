import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { KanbanBoard } from '@/components/kanban/board'
import { getTasks } from '@/app/actions/tasks'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  const tasks = await getTasks(project.id)

  return (
    <div className="flex flex-col h-full p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
      </div>
      <div className="flex-1 overflow-hidden">
         <KanbanBoard initialTasks={tasks} />
      </div>
    </div>
  )
}
