/**
 * Bayes' rule for a binary diagnostic test.
 *
 * This file is a SPEC for Ben to implement — per the repo rules, Claude writes
 * the signature + docstring, Ben writes the math. The Bayes-grid widget imports
 * `posterior` and calls it to show the exact answer; until the body is filled
 * in, the widget's grid (the "simulate" step) still works and the formula panel
 * shows a "not implemented yet" note.
 */

export interface DiagnosticTest {
  /** Prior P(D): base rate of the condition in the population. In [0, 1]. */
  prevalence: number
  /** P(+ | D): sensitivity / true-positive rate. In [0, 1]. */
  sensitivity: number
  /** P(− | ¬D): specificity / true-negative rate. In [0, 1]. */
  specificity: number
}

/**
 * Posterior probability P(D | +): given a positive test result, how likely is
 * it the person actually has the condition?
 *
 * Bayes' rule, with the denominator expanded by the law of total probability:
 *
 *     P(D | +) =            P(+ | D) · P(D)
 *                ----------------------------------------
 *                P(+ | D) · P(D) + P(+ | ¬D) · P(¬D)
 *
 * where P(+ | ¬D) = 1 − specificity (the false-positive rate) and P(¬D) = 1 − prevalence.
 *
 * @param test prevalence, sensitivity and specificity, each in [0, 1].
 * @returns P(D | +) in [0, 1]. (When P(+) = 0 the posterior is undefined;
 *          decide what to return in that case and document it.)
 */
export function posterior(test: DiagnosticTest): number {
  const { prevalence, sensitivity, specificity } = test
  // TODO(Ben): implement Bayes' rule and return P(D | +).
  throw new Error(
    `posterior() is not implemented yet — write it in src/math/bayes.ts. ` +
      `Received prevalence=${prevalence}, sensitivity=${sensitivity}, specificity=${specificity}.`
  )
}
