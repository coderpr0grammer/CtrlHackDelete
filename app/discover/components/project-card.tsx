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
  const progress = (project.current_amount / project.goal_amount) * 100;
  
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {project.image_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
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
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium leading-none pr-2">
            {project.title}
          </CardTitle>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
            {project.category}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">
                ${project.current_amount.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">
                of ${project.goal_amount.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{Math.round(progress)}% funded</span>
                <span>•</span>
                <span>by {project.creator}</span>
              </div>
              <span>{formatDate(project.end_date)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 