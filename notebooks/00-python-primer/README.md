# Python primer for MLMA

A from-zero path through Python and the libraries used in the MLMA labs.
The goal: after Chapter 11, every line of `labs/2026_MLMA_Lab1.ipynb` (and the probability labs after it) is readable.

## How to run

From the repo root:

```bash
uv sync
uv run jupyter lab
```

Then open `notebooks/00-python-primer/01-basics.ipynb`.

## How each chapter works

1. A short explanation, followed by an example cell. Run it and change it.
2. **Exercises**: fill in the `...` or `# YOUR CODE HERE` in the exercise cell.
3. **Check cell**: run it right after. `Exercise X.Y passed` means you're done; an `AssertionError` message says what was expected.
4. **Predict** exercises: commit to a guess *before* running anything. Check cells contain the expected values, so don't read them first.
5. Stuck for ~10 minutes: open the hint, then look in `solutions/` only as a last resort.

Every check cell fails until you've solved its exercise, so nothing passes by accident.

## Chapters

| # | notebook | topics | MLMA Lab 1 sections |
|---|---|---|---|
| 1 | `01-basics` | variables, types, casting, operators, `math`, f-strings | 1–3 |
| 2 | `02-collections` | strings, lists, tuples, dicts, sets, slicing, aliasing | 4 |
| 3 | `03-control-flow` | `if`, `for`, `while`, `enumerate`, `zip`, comprehensions, plain-Python Monte Carlo | 5–6 |
| 4 | `04-functions` | `def`, `return` vs `print`, defaults, keyword args, `lambda`, functions as arguments | 7–8 |
| 5 | `05-classes-errors-modules` | classes, the `fit`/`predict` pattern, exceptions, imports, files | 9–11 |
| 6 | `06-numpy-arrays` | arrays, shape/dtype, 2-D indexing, vectorization, boolean masks | NumPy |
| 7 | `07-numpy-linalg-random` | `axis`, broadcasting, reshape/stack, linear algebra, seeded `rng`, simulation | NumPy |
| 8 | `08-matplotlib` | `fig, ax`, line/scatter/hist/bar/step plots, subplots, shading, contours | Matplotlib |
| 9 | `09-scipy` | `scipy.stats` distributions, `quad`, `minimize`, maximum likelihood, sparse, `.mat` | SciPy |
| 10 | `10-pandas` | DataFrames, selection, missing values, `groupby`, conditional frequencies, one-hot | pandas, Titanic |
| 11 | `11-capstone` | simulate a Titanic-like dataset, full scikit-learn pipeline, Bayes-optimal accuracy, bootstrap | Titanic |

Chapters 1–5 are core Python, 6–10 are the libraries, and 11 puts everything together. Exercises within the capstone build on each other.
Everything runs offline: the pandas and capstone chapters use small built-in or simulated data instead of downloading the Titanic CSV.

Total: 133 exercises (12–13 per chapter).
