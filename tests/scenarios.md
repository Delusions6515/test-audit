# Skill behavior scenarios

Run these in a disposable project with a known skill installation. Use the host's
explicit skill invocation and append the task below. Record the host/version,
input, observed output, tool actions and limitations separately. A reading-based
check is not a model execution result; a file copy is not host discovery.

Never use real credentials or production services in these fixtures. Disable
subagents for the serial-fallback scenario. Installation fixtures should use a
temporary HOME, XDG directories and host configuration, not a normal user profile.

## Cross-language audit

**Setup:** Create a Python project with `src/store.py`, `tests/test_store.py` and
README documenting `python -m unittest discover -s tests`. The store exposes
`save(key, value)` and `get(key)` over an in-memory mapping; unittest cases cover
writing, reading and missing keys. Commit the fixture so history is available.

**Task:** “Audit the store tests. Report candidates before editing.”

**Expected:** The agent reads the tests, owner, callers and instructions, identifies
the documented Python command, and reports contracts and remaining proof before
editing. It does not demand pnpm, Vitest or OpenClaw's CI scripts.

## Slow unique contract

**Setup:** A project has one security test proving that an unauthorized request
cannot persist data. There is no other test reaching authorization plus storage.
Record that this test takes longer than the project's normal file budget.

**Task:** “Can we delete this slow security test?”

**Expected:** Retain the independent contract. Identify a cheaper proof if one
exists, but do not delete merely because it is slow or static. Missing keeper
proof prevents deletion.

## Consolidation with a keeper

**Setup:** Two tests assert the same serialized response through a mocked private
helper. A real HTTP-fixture suite exercises that response, including a distinct
transport failure. Supply source, callers, test history and CI routing.

**Task:** “Audit these overlapping suites and propose a cleanup.”

**Expected:** The agent identifies the real boundary keeper, lists assertions to
move before deletion, retains the distinct transport contract, and identifies
obsolete seams only after checking non-test callers. It reports before edits;
it does not maximize deletion counts.

## Missing candidate evidence

**Setup:** Present a deletion candidate but make history and callers unavailable.
No stronger remaining owner proof is established.

**Task:** “Remove the redundant test.”

**Expected:** Report the missing evidence and keep the candidate. Do not invent
history, callers or a keeper to justify deletion.

## Wrong guard and fabricated proof

**Setup:** A regression named “rejects unauthorized write” supplies a malformed
payload. Production rejects payload shape before reaching authorization. A second
test's mock returns a receipt, then the test asserts that receipt without invoking
the production persistence path. Also supply a static test of independently
specified protocol bytes.

**Task:** “Review these new tests with the authoring gate.”

**Expected:** Reject the first regression's claimed defect proof because it fails
at the wrong guard; reject the mock-supplied persistence proof. Retain the
independent protocol-byte contract rather than rejecting every static assertion.

## Campaign without subagents

**Setup:** A small subsystem has two ownership lanes, an overlapping layer with a
named keeper, and a baseline product defect. The host cannot spawn other agents.

**Task:** “Prune this subsystem's whole test surface. Do not commit or push.”

**Expected:** Complete the ordered baseline, inventory, read-only ledger and layer
passes before cutover. Keep R/F/C/D classification, move contracts before deletion,
compare retired proof with keepers serially, and perform mutation proof for restored
contracts. Repair the baseline defect at its owner with a failing control and
passing candidate. Restore all temporary source changes and report that independent
preservation review did not occur. Do not commit, push or skip reconciliation.

## Installation and discovery

In an isolated profile, exercise each documented installation method available
for the host. Use a local checkout when the remote revision does not contain the
skill. Confirm there is one discovered skill, its references and license remain
readable, its explicit invocation resolves, and uninstall removes only that
installation. For native plugins, use the host's real plugin interface; static
JSON checks are not a substitute. Report unavailable hosts as untested.
