
// Update your DiscoverPage.tsx
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
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { type Project } from "@/types/database"
import { ProjectCard } from "./components/project-card"
import { Input } from "@/components/ui/input"
import Fuse from "fuse.js"
import { SearchBar } from "./components/searchbar"
import { ProjectGrid } from "./components/project-grid"


export const searchProjects = (
  items: Project[],
  query: string | null
) => {
  if (!query) return items;

  const options = {
    keys: ['title', 'description'],
    threshold: 0.4,
    ignoreLocation: true,
  };

  const searchWords = query.toLowerCase().split(' ');
  const fuse = new Fuse(items, options);

  let filteredItems = items;
  searchWords.forEach((word) => {
    filteredItems = fuse.search(word).map(result => result.item);
  });

  return filteredItems;
};

// Modify getProjects to accept searchQuery
async function getProjects(searchQuery?: string | null, userId?: string) {
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
        image_url,
        category,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.throwOnError();

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    const projects = data
      .map(project => {
        if (!project.id || !project.title || !project.description || 
            typeof project.goal_amount !== 'number' || 
            typeof project.current_amount !== 'number') {
          return null;
        }

        try {
          new Date(project.end_date).toISOString();
        } catch (e) {
          return null;
        }

        return project as Project;
      })
      .filter((p): p is Project => p !== null);

    // Apply search if query exists
    return searchQuery ? searchProjects(projects, searchQuery) : projects;

  } catch (error) {
    console.error('Error in getProjects:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects');
  }
}


// Update the page component to use searchParams
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  try {
    const projects = await getProjects(searchParams.q)
    
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
              <SearchBar />
              {/* <Button size="sm" asChild>
                <a href="/projects/new">
                  <PlusCircle className="h-4 w-4" />
                  Create Project
                </a>
              </Button> */}
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <Suspense fallback={
            <ProjectGrid projects={[]} />
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