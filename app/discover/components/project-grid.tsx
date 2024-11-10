import { Project } from "@/types/database";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: Project[] }) {
    if (!projects.length) {
      return (
        <div className="flex flex-col items-center justify-center p-12 h-full text-center bg-secondary/30 rounded-lg">
          <p className="text-lg font-medium">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to create a project!
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
    )
  }
  