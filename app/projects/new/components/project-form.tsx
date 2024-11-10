'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  "Education",
  "Environment",
  "Technology",
  "Arts",
  "Community",
  "Health",
]

export function ProjectForm({
  createProject,
  userId,
}: {
  createProject: (formData: FormData) => Promise<void>
  userId: string
}) {
  return (
    <form action={createProject}>
      <input type="hidden" name="userId" value={userId} />
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalAmount">Goal Amount ($)</Label>
            <Input
              id="goalAmount"
              name="goalAmount"
              type="number"
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" name="imageUrl" type="url" />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 