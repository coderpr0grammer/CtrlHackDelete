'use client'

import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ProjectForm } from "./components/project-form"
import { useICP } from "@/app/infrastructure/ICP/ICPContext"

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

  if (!principal) {
    return (
      <div className="container max-w-2xl py-8">
        <h1 className="text-2xl font-bold text-red-500">Please connect your wallet first</h1>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-2xl font-bold">Create New Project</h1>
      <ProjectForm createProject={createProject} userId={principal.toString()} />
    </div>
  )
} 