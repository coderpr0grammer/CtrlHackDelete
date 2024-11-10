'use client'

import { useEffect, useState } from "react"
import { type Project } from "@/types/database"
import { supabase } from "@/lib/supabase"
import { ProjectGrid } from "./components/project-grid"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DiscoverPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
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
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const validProjects = data
          .map(project => {
            if (!project.id || !project.title || !project.description || 
                typeof project.goal_amount !== 'number' || 
                typeof project.current_amount !== 'number') {
              return null
            }

            try {
              new Date(project.end_date).toISOString()
            } catch (e) {
              return null
            }

            return project as Project
          })
          .filter((p): p is Project => p !== null)

        setProjects(validProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects()

    // Set up real-time subscription
    const subscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        () => {
          fetchProjects()
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">Discover Projects</h1>
            <p className="text-sm text-muted-foreground">
              Browse and fund innovative projects
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            <div>Loading projects...</div>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}