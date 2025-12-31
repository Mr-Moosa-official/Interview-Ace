"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Mic,
  BarChart3,
  Settings,
  User,
} from "lucide-react";
import { Logo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-lg font-semibold">Interview Ace</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip="Dashboard"
              >
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/interview")}
                tooltip="New Interview"
              >
                <Link href="/interview">
                  <Mic />
                  <span>New Interview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/progress")}
                tooltip="Progress"
              >
                <Link href="/progress">
                  <BarChart3 />
                  <span>Progress</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            {userAvatar && (
              <Image
                src={userAvatar.imageUrl}
                alt={userAvatar.description}
                width={40}
                height={40}
                className="rounded-full"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Alex Doe</span>
              <span className="text-muted-foreground">alex.doe@email.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-30 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
             {/* Can add page title here dynamically if needed */}
          </div>
          <Button variant="ghost" size="icon">
             <Settings className="h-5 w-5"/>
             <span className="sr-only">Settings</span>
          </Button>
           <Button variant="ghost" size="icon">
             <User className="h-5 w-5"/>
             <span className="sr-only">Profile</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
