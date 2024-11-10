'use client'

import { type Project } from "@/types/database"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

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
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between flex-col h-full">
        <div>
          {project.image_url && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
              <img
                src={project.image_url}
                alt={project.title}
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold leading-none tracking-tight pr-2">
                {project.title}
              </CardTitle>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {project.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </CardHeader>
        </div>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-lg font-semibold">
                  ${project.current_amount.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  of ${project.goal_amount.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{Math.round(progress)}% funded</span>
                  <span>•</span>
                  <span>by {project.creator}</span>
                </div>
                <span className="font-medium">{formatDate(project.end_date)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full font-semibold transition-all hover:shadow-md"
          >
            Fund This Project
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
} 