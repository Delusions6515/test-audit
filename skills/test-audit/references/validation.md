# Testing and validation

## Proof policy

- Use the target project's documented local, CI and review gates; do not assume
  broad CI exists or import another project's default CI strategy. Before handoff,
  prove touched contracts locally and narrowly with focused tests and applicable
  type, lint and format checks. Identify the real commands before running them.
- Remote machines are exceptions for gaps local proof cannot cover: another
  OS/device, live services, long E2E, or heavy benchmarks. Use only authorized
  resources. If unavailable, run safe local proof and record the remaining gap,
  rather than waiting indefinitely or chaining unapproved hosting fallbacks.
- Never rerun or re-push just for green. Fix real failures; read available
  CI failure classification before attributing red.
- Prove changed contract, complete required gates, finish. Broaden/repeat only for
  changed inputs, failures, or named unresolved risk.
- Follow root and scoped project instructions; authoring/reviewing tests: use the
  [boundary guide](testing.md#prove-behavior-at-the-owning-boundary) and
  [test-audit](../SKILL.md).

## Select the proof

Read the project's instructions, manifests, test configuration and CI routing.
If an entry point cannot be established, report that gap rather than inventing
commands or treating missing checks as passed.

- Runtime defect: reproduce real entry point; rerun it + relevant siblings.
- Trusted source: use the project's changed-scope checks and focused tests.
- Public SDK/plugin contract: representative consumers, not an all-plugin sweep.
- Build output, lazy imports, package boundaries: include the relevant build.
- Workflow: `git diff --check` + the project's workflow checks.
- Docs only: relevant docs/link/format checks + `git diff --check`; no runtime tests.
- Mock-service boundary proof is valid; state live gaps.
- Release proof: preserve candidate and tooling revisions; never grants publication
  authority. Follow the project's package, container, platform and release rules
  only where the changed contract needs them.

## Source and state boundaries

- Never execute untrusted contributor/fork code, wrappers or config locally.
  Use authorized secretless CI or a sanitized isolated environment; never hydrate
  untrusted execution with credentials. Credentialed execution requires maintainer
  approval after review.
- Isolated state + free port. Never restart, edit, or test operator services/real
  data without explicit per-task approval. Preserve unrelated processes and
  shared dependency installs.
- Concurrent tests/checks need separate mutable caches or serial execution;
  checks can invoke the test runner too. Use the project's wrappers when required,
  not a raw runner that bypasses their setup. Preserve prepared linked worktrees
  and avoid dependency reconciliation that rewrites shared installs.
- Never edit a checkout during an active test run. For mutation/control proof,
  preserve the starting bytes and unrelated edits, preferably in an isolated
  working copy. Restore the source byte for byte and verify restoration before
  proceeding; do not use a blanket reset that discards someone else's changes.

## CI failures

- Bind diagnosis to exact revision + job. Fetch failed logs once; prefer exact
  run/job state over stale PR rollups.
- Distinguish product, harness, infrastructure, credentials, superseded-run
  cancellation. Snapshots pass on one OS/fail CI: reproduce CI's platform/runtime
  bytes before regenerating.

## Test failure policy

- Failures = defects. Bounded reproduction attempt (same shard order first);
  identify owner; fix product, fixture, shared-state, ordering bugs.
- Proven repair: add regression; cite another owner's fix when applicable.
- Safe fix cannot be established/completed: record original failure, attempts,
  evidence, uncertainty in the handoff; continue under the project's normal
  CI/review gates. Unresolved failure alone neither blocks landing nor requires
  extra approval beyond those gates. Passing replay ≠ proven fix.
- Never hide failures with retries, longer timeouts, weaker assertions, broader
  mocks, altered baselines.
