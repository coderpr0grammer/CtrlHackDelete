"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-2 px-2 text-xs font-medium text-muted-foreground">
        MAIN NAVIGATION
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              data-active={item.isActive}
              className="group relative"
            >
              <Link href={item.url} className="transition-colors">
                <item.icon className="size-5 text-muted-foreground/50 transition-colors group-hover:text-foreground group-data-[active=true]:text-primary" />
                <span className="font-medium">{item.title}</span>
                {item.isActive && (
                  <span className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-gradient-to-b from-primary to-primary/80" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
