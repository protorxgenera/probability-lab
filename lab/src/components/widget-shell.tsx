import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getWidgetProgress, setRevealed } from "@/lib/progress"

export interface WidgetShellProps {
  /** Stable id, used as the localStorage key for progress. */
  id: string
  title: string
  description?: ReactNode
  /**
   * The prediction input (slider/field). Always visible — the learner sets it
   * BEFORE revealing.
   */
  prediction: ReactNode
  /** The simulate/reveal area. Receives whether it has been revealed yet. */
  children: (revealed: boolean) => ReactNode
  /**
   * Live formula display. Receives `revealed` so it can show the structure
   * while guessing and the computed result only after the reveal.
   */
  formula: (revealed: boolean) => ReactNode
  /** One-line "what to notice", shown after the reveal. */
  whatToNotice: ReactNode
  revealLabel?: string
  /** Called when the learner reveals — use it to record prediction accuracy. */
  onReveal?: () => void
}

/**
 * Shared shell every widget uses. It lays out the four required parts from
 * CLAUDE.md — a prediction input, a simulate/reveal step, a live formula, and a
 * one-line "what to notice" — and remembers the reveal state per widget.
 */
export function WidgetShell({
  id,
  title,
  description,
  prediction,
  children,
  formula,
  whatToNotice,
  revealLabel = "Simulate & reveal",
  onReveal,
}: WidgetShellProps) {
  const [revealed, setRevealedState] = useState(
    () => getWidgetProgress(id).revealed ?? false
  )

  function handleReveal() {
    onReveal?.()
    setRevealedState(true)
    setRevealed(id, true)
  }

  function handleReset() {
    setRevealedState(false)
    setRevealed(id, false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Step n={1} label="Predict">
          {prediction}
        </Step>

        <div>
          {revealed ? (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset & predict again
            </Button>
          ) : (
            <Button onClick={handleReveal}>{revealLabel}</Button>
          )}
        </div>

        <Step n={2} label="Simulate">
          {children(revealed)}
        </Step>

        <Step n={3} label="Formula">
          {formula(revealed)}
        </Step>

        {revealed ? (
          <p className="border-l-2 border-primary pl-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              What to notice:{" "}
            </span>
            {whatToNotice}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function Step({
  n,
  label,
  children,
}: {
  n: number
  label: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] text-foreground">
          {n}
        </span>
        {label}
      </h3>
      {children}
    </section>
  )
}
