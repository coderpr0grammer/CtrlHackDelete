'use client'

import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ProjectForm } from "./components/project-form"
import { useICP } from "@/app/infrastructure/ICP/ICPContext"
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

export default function NewProjectPage() {
  const { principal } = useICP()

  async function createProject(formData: FormData) {

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const goalAmount = parseInt(formData.get('goalAmount') as string)
    const endDate = formData.get('endDate') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string
    const userId = formData.get('userId') as string

    if (!userId) {
      throw new Error('Must connect wallet before creating project')
    }

    const { error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        goal_amount: goalAmount,
        current_amount: 0,
        end_date: new Date(endDate).toISOString(),
        creator: 'Current User',
        category,
        image_url: imageUrl,
        user_id: userId
      })

    if (error) {
      throw new Error('Failed to create project')
    }

    redirect('/discover')
  }


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
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm font-medium">
                    New
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* <SearchBar /> */}
            {/* <Button size="sm" asChild>
            <a href="/projects/new">
              <PlusCircle className="h-4 w-4" />
              Create Project
            </a>
          </Button> */}
          </div>
        </header>


        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className=" text-2xl font-bold">Create New Project</h1>
          {!principal ?
            <div className="container">
              <h1 className="text-sm ">Please connect your wallet in order to create a project.</h1>
            </div> : <ProjectForm createProject={createProject} userId={principal.toString()} />}

        </div>
      </SidebarInset>
    </SidebarProvider>

  )
} 