'use client'

import { Home, Users, UserCog, Shield, LogOut, UsersRound } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/useAuthStore"
import Image from "next/image"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: UsersRound,
  },
  {
    title: "Patients",
    url: "/dashboard/patients",
    icon: Users,
  },
  {
    title: "Doctors",
    url: "/dashboard/doctors",
    icon: UserCog,
  },
  {
    title: "Verifications",
    url: "/dashboard/verifications",
    icon: Shield,
  },
  // {
  //   title: "Appointments",
  //   url: "/dashboard/appointments",
  //   icon: Calendar,
  // },
  // {
  //   title: "Prescriptions",
  //   url: "/dashboard/prescriptions",
  //   icon: FileText,
  // },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/analytics",
  //   icon: Activity,
  // },
]

// const settingsItems = [
//   {
//     title: "Settings",
//     url: "/dashboard/settings",
//     icon: Settings,
//   },
// ]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { profile, signOut } = useUserStore()

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/authentication/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 overflow-hidden">
            <Image
              src="/MediConnectLogo.jpg"
              alt="MediConnect Logo"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">MediConnect</h2>
            <p className="text-sm text-muted-foreground">Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    isActive={pathname === item.url}
                    className="w-full justify-start cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.url)}
                    isActive={pathname === item.url}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.profile_picture_url ?? undefined} />
            <AvatarFallback>
              {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.full_name || 'Admin User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}