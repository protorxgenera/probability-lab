/**
 * Lightweight progress tracking for the lab, persisted to localStorage.
 *
 * Everything is wrapped in try/catch so the app still works where storage is
 * unavailable (private windows, blocked cookies, SSR). On any failure we fall
 * back to an in-memory default and simply don't persist.
 */

const STORAGE_KEY = "prob-lab:progress"
const MAX_PREDICTIONS = 20

export interface PredictionRecord {
  /** What the learner guessed (same units as `actual`). */
  predicted: number
  /** The value revealed after simulating. */
  actual: number
  /** |predicted − actual|, precomputed for convenience. */
  error: number
  /** ISO timestamp. */
  at: string
}

export interface WidgetProgress {
  revealed?: boolean
  predictions?: PredictionRecord[]
}

export interface LabProgress {
  /** Keyed by widget id. */
  widgets: Record<string, WidgetProgress>
}

function emptyProgress(): LabProgress {
  return { widgets: {} }
}

export function readProgress(): LabProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as LabProgress
    if (!parsed || typeof parsed !== "object" || !parsed.widgets) {
      return emptyProgress()
    }
    return parsed
  } catch {
    return emptyProgress()
  }
}

function writeProgress(progress: LabProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage unavailable — keep going without persisting.
  }
}

export function getWidgetProgress(id: string): WidgetProgress {
  return readProgress().widgets[id] ?? {}
}

export function setRevealed(id: string, revealed: boolean): void {
  const progress = readProgress()
  const widget = progress.widgets[id] ?? {}
  progress.widgets[id] = { ...widget, revealed }
  writeProgress(progress)
}

/** Record a prediction-vs-actual pair so we can show accuracy over time. */
export function recordPrediction(
  id: string,
  predicted: number,
  actual: number
): void {
  const progress = readProgress()
  const widget = progress.widgets[id] ?? {}
  const record: PredictionRecord = {
    predicted,
    actual,
    error: Math.abs(predicted - actual),
    at: new Date().toISOString(),
  }
  const predictions = [...(widget.predictions ?? []), record].slice(
    -MAX_PREDICTIONS
  )
  progress.widgets[id] = { ...widget, predictions }
  writeProgress(progress)
}
