import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"
import { chapterPath, chapters, leafPath } from "@/config/nav"
import { ChapterOverview } from "@/pages/chapter-overview"
import { Home } from "@/pages/home"
import { Placeholder } from "@/pages/placeholder"

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />

        {chapters.map((chapter) => (
          <Route
            key={chapter.slug}
            path={chapterPath(chapter)}
            element={<ChapterOverview chapter={chapter} />}
          />
        ))}

        {chapters.flatMap((chapter) =>
          chapter.items.map((leaf) => (
            <Route
              key={leafPath(chapter, leaf)}
              path={leafPath(chapter, leaf)}
              element={
                leaf.element ?? (
                  <Placeholder
                    title={leaf.title}
                    chapterTitle={`Module ${chapter.module} · ${chapter.title}`}
                  />
                )
              }
            />
          ))
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
