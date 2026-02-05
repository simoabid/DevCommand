'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@prisma/client'
import { Badge } from '@/components/ui/badge'

interface KanbanCardProps {
  task: Task
}

export function KanbanCard({ task }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium leading-none">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs text-muted-foreground">
          {task.description && <p className="mb-2 line-clamp-2">{task.description}</p>}
          {task.dueDate && (
             <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
               {new Date(task.dueDate).toLocaleDateString()}
             </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
