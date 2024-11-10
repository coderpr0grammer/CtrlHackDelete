import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ProjectForm } from "./components/project-form"

export default function NewProjectPage() {
  async function createProject(formData: FormData) {
    'use server'
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const goalAmount = parseInt(formData.get('goalAmount') as string)
    const endDate = formData.get('endDate') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string

    const { error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        goal_amount: goalAmount,
        current_amount: 0,
        end_date: new Date(endDate).toISOString(),
        creator: 'Current User', // TODO: Replace with actual user
        category,
        image_url: imageUrl
      })

    if (error) {
      throw new Error('Failed to create project')
    }

    redirect('/discover')
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-2xl font-bold">Create New Project</h1>
      <ProjectForm createProject={createProject} />
    </div>
  )
} 