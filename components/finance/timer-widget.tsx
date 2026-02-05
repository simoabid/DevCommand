"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startTimer, stopTimer, getActiveTimer } from "@/app/actions/time-tracking"
import { getProjects } from "@/app/actions/projects"

export function TimerWidget() {
    const [activeTimer, setActiveTimer] = useState<any>(null)
    const [elapsed, setElapsed] = useState(0)
    const [loading, setLoading] = useState(true)
    const [projects, setProjects] = useState<any[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    
    // New timer form state
    const [selectedProject, setSelectedProject] = useState("")
    const [description, setDescription] = useState("")
    const [starting, setStarting] = useState(false)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchState()
        return () => stopLocalInterval()
    }, [])

    const fetchState = async () => {
        try {
            const [timer, projectList] = await Promise.all([
                getActiveTimer(),
                getProjects()
            ])
            setProjects(projectList)
            if (timer) {
                setActiveTimer(timer)
                const start = new Date(timer.startTime).getTime()
                const now = new Date().getTime()
                setElapsed(Math.floor((now - start) / 1000))
                startLocalInterval(start)
            } else {
                setActiveTimer(null)
                stopLocalInterval()
                setElapsed(0)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const startLocalInterval = (startTimeMs: number) => {
        stopLocalInterval()
        intervalRef.current = setInterval(() => {
            const now = new Date().getTime()
            setElapsed(Math.floor((now - startTimeMs) / 1000))
        }, 1000)
    }

    const stopLocalInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const handleStart = async () => {
        if (!selectedProject) return
        setStarting(true)
        try {
            await startTimer(selectedProject, description)
            setDialogOpen(false)
            setDescription("")
            setSelectedProject("")
            await fetchState()
        } catch (e) {
            console.error(e)
            alert("Failed to start timer")
        } finally {
            setStarting(false)
        }
    }

    const handleStop = async () => {
        setLoading(true) // Reuse loading for stopping
        try {
            await stopTimer()
            await fetchState()
        } catch (e) {
            console.error(e)
            alert("Failed to stop timer")
        } finally {
            setLoading(false)
        }
    }

    if (loading && !activeTimer) {
        return <Button variant="outline" size="sm" disabled><Loader2 className="w-4 h-4 animate-spin" /></Button>
    }

    if (activeTimer) {
        return (
            <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-muted/50">
                <div className="flex flex-col text-xs">
                    <span className="font-medium max-w-[100px] truncate">{activeTimer.project?.name || 'Unknown Project'}</span>
                    <span className="font-mono text-primary">{formatTime(elapsed)}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleStop} disabled={loading}>
                    <Square className="w-4 h-4 fill-current" />
                </Button>
            </div>
        )
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Play className="w-3.5 h-3.5" /> Start Timer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start Timer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Project</Label>
                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="What are you working on?" 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleStart} disabled={!selectedProject || starting}>
                        {starting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Start
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
