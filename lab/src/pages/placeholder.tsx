const LOOP = ["Predict", "Simulate", "Derive", "Verify", "Explain"]

/** Shown for lessons that are in the plan but not built yet. */
export function Placeholder({
  title,
  chapterTitle,
}: {
  title: string
  chapterTitle: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {chapterTitle}
        </p>
        <h1 className="font-heading text-2xl font-medium">{title}</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        <p>This lesson is planned but not built yet.</p>
        <p>When it is, it will follow the usual loop:</p>
        <ol className="flex flex-wrap gap-2">
          {LOOP.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-foreground"
            >
              <span className="text-muted-foreground">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
