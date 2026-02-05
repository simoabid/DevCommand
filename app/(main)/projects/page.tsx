import { getProjects, getClients } from '@/app/actions/projects'
import { ProjectDialog } from '@/components/project-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function ProjectsPage() {
  const projects = await getProjects()
  const clients = await getClients()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
          <ProjectDialog clients={clients} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
           <div className="col-span-full text-center text-muted-foreground p-10">
             No projects found. Create one to get started.
           </div>
        ) : (
            projects.map((project) => (
            <Card key={project.id}>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="truncate">{project.name}</CardTitle>
                    <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {project.status}
                    </Badge>
                </div>
                <CardDescription>{project.client.name}</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {project.budget ? `$${Number(project.budget).toFixed(2)}` : 'No Budget'}
                </div>
                <p className="text-xs text-muted-foreground">
                    Created {format(new Date(project.createdAt), 'PPP')}
                </p>
                </CardContent>
                <CardFooter>
                    <Link href={`/projects/${project.id}`} className="w-full">
                        <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                </CardFooter>
            </Card>
            ))
        )}
      </div>
    </div>
  )
}
