"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Unplug,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useICP } from "@/app/infrastructure/ICP/ICPContext"
import { Button } from "./ui/button"
import { useEffect } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()

  const { isConnected, principal, connect, disconnect, balance } = useICP();

  useEffect(() => { 
   console.log("balance", balance)
  }, [balance])
  return (
    <SidebarMenu>
      <SidebarMenuItem>

        {isConnected ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton


                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={`https://avatar.vercel.sh/${principal?.toString()}.png`} alt={principal?.toString()} />

                  <AvatarFallback className="rounded-lg">ICP</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {!isConnected && <span className="font-bold text-md">Connect Wallet</span>}
                  <span className="truncate font-semibold">{principal?.toString()}</span>
                  <span className="truncate text-xs">Balance: {balance?.toString()}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={`https://avatar.vercel.sh/${principal?.toString()}.png`} alt={principal?.toString()} />
                    <AvatarFallback className="rounded-lg">ICP</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{principal?.toString()}</span>
                    <span className="truncate text-xs">{principal?.toString()}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={disconnect}>
                <Unplug />
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) :

          <Button className="w-full py-4" onClick={() => {
            connect()
          }}>
            Connect Wallet
          </Button>

        }

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
