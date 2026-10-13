# Writing and adding tests

## Prove behavior at the owning boundary

Prove a caller-visible contract through its production owner with fixed external
I/O fixtures and independent expected values. Prefer focused integration tests
and independent unit contracts over mocked internal decisions or whole-product
boots. Name the credible regression and what the test cannot prove.

Work in vertical slices: failing behavior, coherent repair, passing proof.
Regressions must fail on the original defect, not fixture setup; report unavailable
baseline proof. Refactor under green tests and preserve distinct contracts when
consolidating coverage. Use synthetic content and keep credentials out of captures.

Apply the [test value gate](../SKILL.md#authoring-gate) and
[proof policy](validation.md#proof-policy). For requests, paid calls, recovery,
defaults, or performance claims, read [scenario contracts](#scenario-contracts)
before changing code or proof. Too many private controls suggest fragmented
ownership, not a need for test-only exports.

## Cost budget

Measure each new or materially changed file with the target project's focused
runner and documented worker settings; report wall time and CI seconds once
available. Find commands and budgets in project instructions, manifests, test
configuration, and CI. Do not assume a language, runner, or universal time limit.

- Use the project's file and job budgets. For expensive proof, explain the
  contract and why no cheaper layer proves it. Slow alone is not a deletion reason.
- Split files exceeding job budgets by owner, or use the project's established
  release-only routing. Weigh PR risk against release detection; keep coverage
  without duplicate release tests. Preserve assigned configs and process/timer
  policies; product E2E/live stays separate.
- Inject clocks; avoid real timers, sleeps, and polling. Use the project's port
  allocation helpers or OS-assigned free ports, isolate each file's state, and
  reuse suite-level process fixtures. Import narrow APIs, not broad barrels.
  Fix shared state instead of adding serial configs or worker pins.
- For compiled subprocesses, run the actual built entry point and establish
  required build/preload state before invocation. Use the project's timeout
  helpers and bounded waits for real completion signals, not arbitrary sleeps.

## Fixture lifecycle

Use the target project's existing fixture helpers when available.

- Create test-owned temporary directories and register cleanup immediately.
  Close files, subprocesses and other resources before removing their directories.
  A bare directory without a helper must still have reliable cleanup.
- Keep executable fixtures isolated, synthetic and credential-free; preserve the
  permissions and platform behavior needed by the exercised entry point.
- Module mocks must preserve exports consumed by the real path and isolate state
  between cases. Restore replaced modules and globals. Do not implement the
  asserted behavior in the mock; follow any local mock annotations or baselines.
- Before raw database reads or file snapshots, await writes and the actual
  asynchronous close/flush contract. Do not treat requesting a close as completion.
- For skill discovery, close background workers/watchers and isolate passive
  refresh. Installing or copying files proves neither model selection nor compliance.
- For agent reliability evals, separate selection, single-turn compliance and
  multi-turn workflow behavior. Use explicit inputs and independently judged
  expected outcomes; keep provider calls opt-in and report the host and limits.

## Scenario contracts

Use focused integration tests through production owners with fixed external I/O
fixtures. Keep independent unit contracts. Apply the
[test value gate](../SKILL.md#authoring-gate) and
[proof policy](validation.md#proof-policy).

- Name the caller-visible contract, credible regression, and proof limits. Use
  independent expected values and the caller's interface. Exact bytes, storage,
  call counts, and ordering belong when they protect storage, billing, delivery,
  or protocol contracts.
- Work in vertical slices: failing behavior, coherent repair, passing proof.
  A regression must fail on the original defect, not fixture setup; report
  unavailable baseline proof. Refactor under green tests; check distinct
  contracts before replacing redundant tests.
- Capture final serialized requests and resolved routing after real assembly:
  instructions, tools/order, input prefix, parameters, cache identity, endpoint,
  and auth mode. Warm-prefix reuse shares one preparation owner; document
  permitted differences. Standalone summaries need an intentional contract.
- Keep a paid provider result or never request it. Preflight predictable failures
  before calling. Distinguish not sent, uncertain, completed, and persisted;
  reconcile uncertainty. Exactly-once claims need proof retries cannot duplicate
  effects. Inject relevant failures and assert physical requests/usage, including
  rejected results. Local processing errors must not silently buy another call;
  preserve valid results without bypassing redaction, cancellation, or authority.
- Prove recovery through its diagnostic consumer with a sanitized reason/outcome.
  Warn on unexpected degradation; expected recovery may use a documented
  structured outcome. Persist replay decisions, reconstruct, and exercise the
  next request. Cover relevant compaction, switching, and concurrent edits;
  transient errors must not become permanent bans.
- Exercise defaults across affected routes, auth modes, capabilities, and stored
  states through execution's eligibility owner. Cover supported and unsupported
  cases, not copied capability tables or precomputed flags.
- Support cost/performance claims with comparable request counts, input/cached/
  output tokens, and latency; name model, route, and conditions. Live cache or
  billing claims need live evidence; label estimates. Unrelated edits do not
  require paid benchmarks.

Use synthetic content; keep credentials out of captures. Select failure cases
from the changed contract. Many private controls suggest fragmented ownership,
not a need for more test-only exports.

## Flake triage

Follow the [test failure policy](validation.md#test-failure-policy).
Reproduce the original shard order before running alone; order-only failures
usually mean earlier-file shared-state leaks. Classify fixture state, missing
completion signals, and product races. Repair the producer. If a removal caused
the red, read its accepted tradeoffs before restoring it. Choose repeat counts
for the reproduced failure mode, not a fixed clean-run quota.

## Adding regressions

Pass bounded synthetic inventories and fixed timing through real planners for
capacity bugs. Preserve coverage, ownership, and execution-budget assertions;
keep real-checkout inventory coverage in its existing integration tests.

For live provider bugs, prefer a CI-safe regression at the smallest production
composition reaching the defect: real adapters with captured requests, integration
for session/history/tool pipelines, or independent parser unit contracts. Keep
inherently live-only checks narrow and opt-in.
