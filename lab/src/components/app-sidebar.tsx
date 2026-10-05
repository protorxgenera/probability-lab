import { useState } from "react"
import { RiArrowRightSLine } from "@remixicon/react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { NavChapter } from "@/config/nav"
import { chapterPath, chapters, leafPath } from "@/config/nav"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Probability Lab"
              render={<Link to="/" />}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-sm font-semibold text-primary-foreground">
                P
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-heading font-medium">
                  Probability Lab
                </span>
                <span className="text-xs text-muted-foreground">
                  for machine learning
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Curriculum</SidebarGroupLabel>
          <SidebarMenu>
            {chapters.map((chapter) => (
              <ChapterNav key={chapter.slug} chapter={chapter} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function ChapterNav({ chapter }: { chapter: NavChapter }) {
  const { pathname } = useLocation()
  const { setOpenMobile, isMobile } = useSidebar()
  const base = chapterPath(chapter)
  const chapterActive = pathname === base || pathname.startsWith(`${base}/`)
  const [open, setOpen] = useState(chapterActive)
  const Icon = chapter.icon

  function closeOnMobile() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
          render={
            <SidebarMenuButton
              isActive={chapterActive && pathname === base}
              tooltip={chapter.title}
            />
          }
        >
          <Icon className="shrink-0" />
          <span className="flex-1 truncate">{chapter.title}</span>
          <RiArrowRightSLine
            className={`shrink-0 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                isActive={pathname === base}
                render={<Link to={base} onClick={closeOnMobile} />}
              >
                Overview
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            {chapter.items.map((leaf) => {
              const href = leafPath(chapter, leaf)
              return (
                <SidebarMenuSubItem key={leaf.slug}>
                  <SidebarMenuSubButton
                    isActive={pathname === href}
                    render={<Link to={href} onClick={closeOnMobile} />}
                  >
                    <span className="flex-1 truncate">{leaf.title}</span>
                    {leaf.status === "planned" ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    ) : null}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
    </Collapsible>
  )
}
