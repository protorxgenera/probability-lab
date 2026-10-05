import { Link } from "react-router-dom"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NavChapter } from "@/config/nav"
import { leafPath } from "@/config/nav"

export function ChapterOverview({ chapter }: { chapter: NavChapter }) {
  const Icon = chapter.icon
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon className="size-4" />
          Module {chapter.module}
        </div>
        <h1 className="font-heading text-2xl font-medium">{chapter.title}</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          {chapter.summary}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Lessons
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {chapter.items.map((leaf) => (
            <Link key={leaf.slug} to={leafPath(chapter, leaf)} className="group">
              <Card size="sm" className="h-full transition-colors group-hover:ring-foreground/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {leaf.title}
                    <StatusBadge status={leaf.status} />
                  </CardTitle>
                  <CardDescription>
                    {leaf.status === "ready"
                      ? "Ready to explore."
                      : "Planned — not built yet."}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: "ready" | "planned" }) {
  if (status === "ready") {
    return (
      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
        ready
      </span>
    )
  }
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      planned
    </span>
  )
}
