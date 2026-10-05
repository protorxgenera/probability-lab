import { useMemo, useState } from "react"

import { Slider } from "@/components/ui/slider"
import { WidgetShell } from "@/components/widget-shell"
import { recordPrediction } from "@/lib/progress"
import { posterior } from "@/math/bayes"

const WIDGET_ID = "bayes-grid"
const N = 1000
const COLS = 40

type Category = "tp" | "fn" | "fp" | "tn"

/** Deterministic breakdown of N people given the three test parameters. */
function breakdown(prevalence: number, sensitivity: number, specificity: number) {
  const sick = Math.round(prevalence * N)
  const healthy = N - sick
  const tp = Math.round(sensitivity * sick)
  const fn = sick - tp
  const fp = Math.round((1 - specificity) * healthy)
  const tn = healthy - fp
  const positives = tp + fp
  return { sick, healthy, tp, fn, fp, tn, positives }
}

const DOT_CLASS: Record<Category, string> = {
  tp: "bg-primary",
  fn: "bg-primary/25",
  fp: "bg-destructive",
  tn: "bg-muted-foreground/20",
}

export function BayesGrid() {
  // Percentages keep the sliders friendly; convert to fractions for the math.
  const [prevalencePct, setPrevalencePct] = useState(1)
  const [sensitivityPct, setSensitivityPct] = useState(95)
  const [specificityPct, setSpecificityPct] = useState(95)
  const [guessPct, setGuessPct] = useState(50)

  const prevalence = prevalencePct / 100
  const sensitivity = sensitivityPct / 100
  const specificity = specificityPct / 100

  const counts = useMemo(
    () => breakdown(prevalence, sensitivity, specificity),
    [prevalence, sensitivity, specificity]
  )

  // Order dots so the structure reads left-to-right: sick first (tp, fn),
  // then healthy (fp, tn).
  const dots = useMemo(() => {
    const { tp, fn, fp, tn } = counts
    return [
      ...Array<Category>(tp).fill("tp"),
      ...Array<Category>(fn).fill("fn"),
      ...Array<Category>(fp).fill("fp"),
      ...Array<Category>(tn).fill("tn"),
    ]
  }, [counts])

  // Empirical P(D|+) straight from the grid (the "simulate" answer).
  const empirical = counts.positives > 0 ? counts.tp / counts.positives : 0

  // Exact P(D|+) from Ben's posterior() (the "derive" answer). Until it's
  // implemented this throws, and we show a note instead.
  let exact: number | null = null
  let exactError: string | null = null
  try {
    exact = posterior({ prevalence, sensitivity, specificity })
  } catch (error) {
    exactError = error instanceof Error ? error.message : String(error)
  }

  const fpr = 1 - specificity // P(+ | ¬D)

  return (
    <WidgetShell
      id={WIDGET_ID}
      title="Diagnostic test: P(disease | positive)"
      description="A rare disease, a good test — and a surprising answer. Guess before you reveal."
      onReveal={() => recordPrediction(WIDGET_ID, guessPct / 100, empirical)}
      whatToNotice={
        <>
          With a rare disease, even a 95%-accurate test makes most positives{" "}
          <span className="text-destructive">false alarms</span>. Drag{" "}
          <em>prevalence</em> down and watch the red dots take over the people
          who tested positive.
        </>
      }
      prediction={
        <div className="flex flex-col gap-4">
          <ParamSlider
            label="Prevalence — P(D)"
            valuePct={prevalencePct}
            onChange={setPrevalencePct}
            min={0.1}
            max={50}
            step={0.1}
          />
          <ParamSlider
            label="Sensitivity — P(+|D)"
            valuePct={sensitivityPct}
            onChange={setSensitivityPct}
            min={50}
            max={100}
            step={0.5}
          />
          <ParamSlider
            label="Specificity — P(−|¬D)"
            valuePct={specificityPct}
            onChange={setSpecificityPct}
            min={50}
            max={100}
            step={0.5}
          />
          <div className="mt-2 border-t pt-4">
            <ParamSlider
              label="Your guess — P(D|+)"
              valuePct={guessPct}
              onChange={setGuessPct}
              min={0}
              max={100}
              step={1}
              accent
            />
          </div>
        </div>
      }
      formula={(revealed) => (
        <FormulaPanel
          prevalence={prevalence}
          sensitivity={sensitivity}
          fpr={fpr}
          empirical={empirical}
          exact={exact}
          exactError={exactError}
          revealed={revealed}
        />
      )}
    >
      {(revealed) => (
        <div className="flex flex-col gap-3">
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            aria-hidden
          >
            {dots.map((category, i) => {
              const isPositive = category === "tp" || category === "fp"
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-[2px] ${DOT_CLASS[category]} ${
                    revealed && isPositive ? "ring-1 ring-foreground/50" : ""
                  }`}
                />
              )
            })}
          </div>

          <Legend />

          {revealed ? (
            <p className="text-sm">
              Of the{" "}
              <strong>{counts.positives}</strong> people who tested positive
              (ringed), only <strong className="text-primary">{counts.tp}</strong>{" "}
              are actually sick and{" "}
              <strong className="text-destructive">{counts.fp}</strong> are false
              alarms.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Set your guess above, then reveal to highlight everyone who tested
              positive.
            </p>
          )}
        </div>
      )}
    </WidgetShell>
  )
}

/** Live Bayes formula: symbolic always, numbers substituted, result on reveal. */
function FormulaPanel({
  prevalence,
  sensitivity,
  fpr,
  empirical,
  exact,
  exactError,
  revealed,
}: {
  prevalence: number
  sensitivity: number
  fpr: number
  empirical: number
  exact: number | null
  exactError: string | null
  revealed: boolean
}) {
  const num = sensitivity * prevalence
  const denom = num + fpr * (1 - prevalence)
  const f = (x: number) => x.toFixed(3)
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-4 font-mono text-xs leading-relaxed">
      <div>
        P(D|+) ={" "}
        <span className="text-muted-foreground">
          P(+|D)·P(D) / [ P(+|D)·P(D) + P(+|¬D)·P(¬D) ]
        </span>
      </div>
      <div>
        = ({f(sensitivity)}·{f(prevalence)}) / ({f(sensitivity)}·{f(prevalence)}{" "}
        + {f(fpr)}·{f(1 - prevalence)})
      </div>
      <div>
        = {f(num)} / {f(denom)}
      </div>
      {revealed ? (
        exact === null ? (
          <div className="text-destructive">
            exact value unavailable — {exactError}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold text-foreground">
              = {pct(exact)} &nbsp;(exact, via posterior())
            </div>
            <div className="text-muted-foreground">
              grid gives {pct(empirical)} — agrees up to rounding to {N} people
            </div>
          </div>
        )
      ) : (
        <div className="text-muted-foreground">= ?&nbsp;&nbsp;(reveal to compute)</div>
      )}
    </div>
  )
}

function Legend() {
  const items: { category: Category; label: string }[] = [
    { category: "tp", label: "sick, tested + (true positive)" },
    { category: "fn", label: "sick, tested − (missed)" },
    { category: "fp", label: "healthy, tested + (false alarm)" },
    { category: "tn", label: "healthy, tested − (true negative)" },
  ]
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map(({ category, label }) => (
        <li key={category} className="flex items-center gap-1.5">
          <span className={`size-3 rounded-[2px] ${DOT_CLASS[category]}`} />
          {label}
        </li>
      ))}
    </ul>
  )
}

function ParamSlider({
  label,
  valuePct,
  onChange,
  min,
  max,
  step,
  accent = false,
}: {
  label: string
  valuePct: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  accent?: boolean
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between text-sm">
        <span className={accent ? "font-medium" : ""}>{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {valuePct.toFixed(step < 1 ? 1 : 0)}%
        </span>
      </span>
      <Slider
        value={valuePct}
        min={min}
        max={max}
        step={step}
        onValueChange={(value) =>
          onChange(Array.isArray(value) ? value[0] : value)
        }
      />
    </label>
  )
}
