'use client'

import { useDroppable } from '@dnd-kit/core'
import { Task, TaskStatus } from '@prisma/client'
import { KanbanCard } from './card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div className="flex flex-col bg-muted/50 p-4 rounded-lg w-full max-w-xs h-full min-h-[500px]">
      <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground flex items-center justify-between">
        {title}
        <span className="bg-background text-foreground text-xs px-2 py-0.5 rounded-full border shadow-sm">
          {tasks.length}
        </span>
      </h3>
      
      <div ref={setNodeRef} className="flex-1 flex flex-col gap-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
