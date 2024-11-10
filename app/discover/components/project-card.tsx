'use client'

import { type Project } from "@/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Add a utility function for consistent date formatting
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card key={project.id}>
      {project.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
          <img
            src={project.image_url}
            alt={project.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>${project.current_amount.toLocaleString()} raised</span>
              <span className="text-muted-foreground">
                of ${project.goal_amount.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min((project.current_amount / project.goal_amount) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>by {project.creator}</span>
              <span>{project.category}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Ends {formatDate(project.end_date)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 