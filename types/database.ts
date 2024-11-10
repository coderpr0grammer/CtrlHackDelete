export type Project = {
  id: string
  title: string
  description: string
  goal_amount: number
  current_amount: number
  end_date: string
  creator: string
  category: string
  image_url: string | null
  created_at: string
  user_id: string
}

export type Dashboard = {
  id: string
  title: string
  description: string
  layout: DashboardLayout[]
  created_at: string
  user_id: string
}

export type DashboardLayout = {
  id: string
  type: 'chart' | 'metric' | 'table' | 'custom'
  config: Record<string, any>
  position: {
    x: number
    y: number
    w: number
    h: number
  }
}

export type Transaction = {
  id: string
  project_id: string
  sender_id: string
  amount: number
  created_at: string
}
