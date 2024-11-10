import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { projectId, amount } = await req.json()

    // Get current project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('current_amount')
      .eq('id', projectId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      )
    }

    // Update project with new amount
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        current_amount: (project.current_amount || 0) + amount
      })
      .eq('id', projectId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating project funding:', error)
    return NextResponse.json(
      { error: 'Failed to update project funding' },
      { status: 500 }
    )
  }
} 