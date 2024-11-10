import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { type Project } from "@/types/database"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "./components/project-card"

async function getProjects(userId?: string) {
  try {
    console.log('Fetching projects...');
    
    let query = supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        goal_amount,
        current_amount,
        end_date,
        creator,
        category,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false });

    // If userId is provided, filter by it
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.throwOnError();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No data or invalid data format returned');
      return [];
    }

    // Type validation
    const projects = data.map(project => {
      // Ensure all required fields exist and are of correct type
      if (!project.id || !project.title || !project.description || 
          typeof project.goal_amount !== 'number' || 
          typeof project.current_amount !== 'number') {
        console.warn('Invalid project data:', project);
        return null;
      }

      // Convert date strings to proper format
      try {
        new Date(project.end_date).toISOString();
      } catch (e) {
        console.warn('Invalid date format for project:', project.id);
        return null;
      }

      return project as Project;
    }).filter((p): p is Project => p !== null);

    console.log(`Successfully fetched ${projects.length} projects`);
    return projects;

  } catch (error) {
    console.error('Error in getProjects:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects');
  }
}

function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-lg">
        <p className="text-lg font-medium">No projects found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Be the first to create a project!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export default async function DiscoverPage() {
  try {
    const projects = await getProjects()
    console.log('Rendered projects:', projects);
    
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/discover" className="text-sm font-medium">
                      Discover
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm font-medium">
                      Projects
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button size="sm" asChild>
                <a href="/projects/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Project
                </a>
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Suspense fallback={
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            }>
              <ProjectGrid projects={projects} />
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  } catch (error) {
    console.error('Error in DiscoverPage:', error)
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading projects. Please try again later.</p>
        <pre className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
}

