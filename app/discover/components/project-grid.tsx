import { Project } from "@/types/database";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function ProjectGrid({ projects, isLoading }: { projects: Project[], isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "animate-pulse rounded-xl border bg-card shadow-sm",
              "opacity-0 animate-[pulse_2s_ease-in-out_infinite,fadeIn_0.5s_ease-in-out_forwards]",
              "animation-delay-[0ms,${i * 100}ms]"
            )}
          >
            <div className="aspect-[16/9] w-full bg-muted rounded-t-xl" />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-4/5 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="flex justify-between">
                  <div className="h-3 w-1/4 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No projects found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
  