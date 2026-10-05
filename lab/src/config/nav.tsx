import type { ComponentType, ReactNode } from "react"
import {
  RiBarChartBoxLine,
  RiBrainLine,
  RiFlaskLine,
  RiFunctionLine,
  RiInformationLine,
  RiRouteLine,
  RiStackLine,
  RiTargetLine,
} from "@remixicon/react"

import { BayesGrid } from "@/widgets/bayes-grid"

/** A single lesson/topic within a chapter. */
export interface NavLeaf {
  title: string
  /** Slug appended after the chapter slug. Never empty. */
  slug: string
  /** Page content. When omitted, a placeholder is shown. */
  element?: ReactNode
  status: "ready" | "planned"
}

/** A chapter == one module of the study plan. */
export interface NavChapter {
  module: number
  title: string
  slug: string
  icon: ComponentType<{ className?: string }>
  summary: string
  items: NavLeaf[]
}

/**
 * The whole curriculum, data-driven: the sidebar, the routes and the
 * breadcrumbs are all generated from this one array. Add a lesson by adding a
 * leaf; wire a real widget by giving that leaf an `element`.
 */
export const chapters: NavChapter[] = [
  {
    module: 1,
    title: "Foundations & Bayes",
    slug: "foundations",
    icon: RiFlaskLine,
    summary:
      "Sample spaces, conditional probability, independence and Bayes' rule. Probability is area; conditioning zooms into a sub-region and renormalizes.",
    items: [
      {
        title: "Diagnostic-test grid",
        slug: "bayes-grid",
        element: <BayesGrid />,
        status: "ready",
      },
      { title: "Monty Hall", slug: "monty-hall", status: "planned" },
      { title: "Birthday problem", slug: "birthday", status: "planned" },
    ],
  },
  {
    module: 2,
    title: "Discrete random variables",
    slug: "discrete",
    icon: RiBarChartBoxLine,
    summary:
      "PMF/CDF; Bernoulli, binomial, geometric, Poisson; expectation, variance, linearity, LOTUS.",
    items: [
      { title: "Galton board", slug: "galton-board", status: "planned" },
      {
        title: "Distribution explorer",
        slug: "distribution-explorer",
        status: "planned",
      },
    ],
  },
  {
    module: 3,
    title: "Continuous random variables",
    slug: "continuous",
    icon: RiFunctionLine,
    summary:
      "PDF/CDF; uniform, exponential, Gaussian; expectation via integrals; change of variables.",
    items: [
      { title: "PDF ↔ CDF", slug: "pdf-cdf", status: "planned" },
      {
        title: "Transformation machine",
        slug: "transformation-machine",
        status: "planned",
      },
    ],
  },
  {
    module: 4,
    title: "Multivariate Gaussian",
    slug: "multivariate-gaussian",
    icon: RiStackLine,
    summary:
      "Joint, marginal, conditional; covariance matrices; the multivariate Gaussian. The most important module for ML.",
    items: [
      { title: "Joint density surface", slug: "joint-surface", status: "planned" },
      {
        title: "Covariance ellipse",
        slug: "covariance-ellipse",
        status: "planned",
      },
    ],
  },
  {
    module: 5,
    title: "Limit theorems & Monte Carlo",
    slug: "limit-theorems",
    icon: RiRouteLine,
    summary:
      "LLN, CLT, Monte Carlo estimation, and concentration inequalities.",
    items: [
      { title: "CLT machine", slug: "clt-machine", status: "planned" },
      { title: "Monte Carlo π", slug: "monte-carlo-pi", status: "planned" },
    ],
  },
  {
    module: 6,
    title: "Estimation: MLE & MAP",
    slug: "estimation",
    icon: RiTargetLine,
    summary:
      "Likelihood, log-likelihood, MLE, MAP, priors and conjugacy; bias and variance of estimators.",
    items: [
      { title: "Coin-flip posterior", slug: "coin-posterior", status: "planned" },
      {
        title: "Likelihood surface",
        slug: "likelihood-surface",
        status: "planned",
      },
    ],
  },
  {
    module: 7,
    title: "Information theory",
    slug: "information-theory",
    icon: RiInformationLine,
    summary:
      "Entropy, cross-entropy, KL divergence and mutual information — where loss functions come from.",
    items: [
      { title: "Entropy bars", slug: "entropy-bars", status: "planned" },
      { title: "KL both ways", slug: "kl-divergence", status: "planned" },
    ],
  },
  {
    module: 8,
    title: "Bridge to ML",
    slug: "bridge-to-ml",
    icon: RiBrainLine,
    summary:
      "Linear regression as Gaussian MLE, logistic regression as Bernoulli MLE, naive Bayes, mixtures and EM.",
    items: [
      {
        title: "Logistic regression fit",
        slug: "logistic-regression",
        status: "planned",
      },
      { title: "EM on a mixture", slug: "em-mixture", status: "planned" },
    ],
  },
]

export function chapterPath(chapter: NavChapter): string {
  return `/modules/${chapter.slug}`
}

export function leafPath(chapter: NavChapter, leaf: NavLeaf): string {
  return `${chapterPath(chapter)}/${leaf.slug}`
}

export interface Crumb {
  title: string
  /** Absent for the current (last) crumb. */
  href?: string
}

/** Breadcrumb trail for a pathname, derived from the chapter config. */
export function trailFor(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ title: "Home", href: "/" }]
  if (pathname === "/") {
    return [{ title: "Home" }]
  }

  const segments = pathname.split("/").filter(Boolean) // ["modules", chapter, leaf?]
  const chapter = chapters.find((c) => c.slug === segments[1])
  if (!chapter) return crumbs

  const leaf = chapter.items.find((l) => l.slug === segments[2])
  crumbs.push({
    title: chapter.title,
    href: leaf ? chapterPath(chapter) : undefined,
  })
  if (leaf) {
    crumbs.push({ title: leaf.title })
  }
  return crumbs
}
