'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@prisma/client'
import { KanbanColumn } from './column'
import { KanbanCard } from './card'
import { updateTaskStatus } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

interface KanbanBoardProps {
  initialTasks: Task[]
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
]

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'

    if (!isActiveTask) return

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
           const newTasks = [...tasks]
           newTasks[activeIndex] = {
             ...newTasks[activeIndex],
             status: tasks[overIndex].status
           }
           return arrayMove(newTasks, activeIndex, overIndex - 1) // simple visual move, order not persisted yet
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverColumn = COLUMNS.some(col => col.id === overId)

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const newStatus = overId as TaskStatus
        
        if (tasks[activeIndex].status !== newStatus) {
            const newTasks = [...tasks]
            newTasks[activeIndex] = {
                ...newTasks[activeIndex],
                status: newStatus
            }
            return arrayMove(newTasks, activeIndex, activeIndex) // just update status
        }
        return tasks
      })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    let newStatus = activeTask.status

    if (COLUMNS.some(col => col.id === overId)) {
        newStatus = overId as TaskStatus
    } else {
        const overTask = tasks.find((t) => t.id === overId)
        if (overTask) {
            newStatus = overTask.status
        }
    }

    if (activeTask.status !== newStatus) {
         // Optimistic update was mostly done in dragOver, but ensure final state is correct locally
         setTasks(prev => prev.map(t => 
             t.id === activeId ? { ...t, status: newStatus } : t
         ))
         
         // Server Action
         startTransition(async () => {
             await updateTaskStatus(activeId, newStatus)
             router.refresh()
         })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((task) => task.status === col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
            <div className="opacity-80 rotate-2">
                <KanbanCard task={tasks.find((t) => t.id === activeId)!} />
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
