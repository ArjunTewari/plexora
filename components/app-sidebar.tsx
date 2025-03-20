"use client"

import {
  BarChart3,
  Brain,
  Calendar,
  Database,
  Home,
  Settings,
  User,
  AlertTriangle,
  Users,
  FileText,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"

export function AppSidebar() {
  const { data: session } = useSession()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Plexora</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="AI Assistant">
              <Link href="/ai-assistant">
                <Brain className="h-4 w-4" />
                <span>AI Assistant</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Forecasting">
              <Link href="/forecasting">
                <Calendar className="h-4 w-4" />
                <span>Forecasting</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Data Integration">
              <Link href="/data-integration">
                <Database className="h-4 w-4" />
                <span>Data Integration</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Anomaly Detection">
              <Link href="/anomaly-detection">
                <AlertTriangle className="h-4 w-4" />
                <span>Anomaly Detection</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Competitor Analysis">
              <Link href="/competitor-analysis">
                <Users className="h-4 w-4" />
                <span>Competitor Analysis</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Reports">
              <Link href="/reports">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <ModeToggle />
          {session && (
            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

