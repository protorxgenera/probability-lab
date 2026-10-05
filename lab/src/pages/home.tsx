import { Link } from "react-router-dom"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { chapterPath, chapters } from "@/config/nav"

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium">Probability Lab</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          An interactive path through probability for machine learning. Every
          lesson follows the same loop: predict → simulate → derive → verify →
          explain. Pick a chapter to begin.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {chapters.map((chapter) => {
          const Icon = chapter.icon
          const ready = chapter.items.filter((i) => i.status === "ready").length
          return (
            <Link key={chapter.slug} to={chapterPath(chapter)} className="group">
              <Card className="h-full transition-colors group-hover:ring-foreground/20">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Icon className="size-4" />
                    Module {chapter.module}
                    {ready > 0 ? (
                      <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                        {ready} ready
                      </span>
                    ) : null}
                  </div>
                  <CardTitle>{chapter.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {chapter.summary}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
