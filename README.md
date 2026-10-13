# Test Audit

A portable Agent Skill for writing, reviewing and pruning tests. Adapted from
OpenClaw's test-audit, with one self-contained skill shared by Pi, Claude Code,
Codex and Cursor.

- Gate new tests on observable contracts and credible regressions.
- Audit duplicate, implementation-coupled proof and test-only production seams.
- Clean up a subsystem with a retention ledger, named keepers and preservation proof.

The upstream evidence requirements and workflow are preserved. Project-specific
commands, budgets and review tools come from the project being audited. Without
subagents, the same passes run serially, with no claim of independent review.
This skill does not grant permission to commit, push or merge.

## Install

Choose one installation method; do not install multiple copies of the same skill.
Remote commands use the files published on GitHub. For an unpublished checkout,
use the local instructions in [INSTALL.md](INSTALL.md).

### Pi

```sh
pi install git:github.com/Delusions6515/test-audit
```

### Claude Code

```sh
claude plugin marketplace add Delusions6515/test-audit
claude plugin install test-audit@test-audit
```

### Codex or Cursor

Use the existing [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add Delusions6515/test-audit --skill test-audit -a codex -g
npx skills add Delusions6515/test-audit --skill test-audit -a cursor -g
```

Codex also has a native marketplace entry. See [INSTALL.md](INSTALL.md) for
that route, project-local installation, manual copying, discovery and removal.
The skill itself has no runtime dependencies; the chosen host or installer has
its own requirements.

## Use

| Host / installation | Explicit invocation |
| --- | --- |
| Pi | `/skill:test-audit` |
| Claude Code plugin | `/test-audit:test-audit` |
| Claude Code directory or Skills CLI | `/test-audit` |
| Codex directory or Skills CLI | `$test-audit` or select it with `/skills` |
| Cursor | Type `/` in Agent chat and select `test-audit` |

Append a task, for example:

- **Authoring:** “Review this proposed regression for an independent contract and the intended pre-fix failure.”
- **Audit:** “Audit the storage tests. Gather candidate evidence and report before editing.”
- **Campaign:** “Prune the messaging subsystem's whole test surface using the campaign workflow.”

The skill loads [campaign guidance](skills/test-audit/CAMPAIGN.md) and
[bundled references](skills/test-audit/references/audit.md) as needed. Copy the
whole skill directory, not just SKILL.md.

## Development

From a source checkout, run the offline, dependency-free package checks:

```sh
npm test
```

These checks cover standalone references, license distribution and package
entry points. They do not prove model selection or compliance. See
[behavior scenarios](https://github.com/Delusions6515/test-audit/blob/main/tests/scenarios.md)
for host-level checks. Tests are not included in the installed skill package.

## Source and license

Adapted from [OpenClaw test-audit](https://github.com/openclaw/openclaw/tree/799b7a347c502912efb704b1722e117bc0a644ed/.agents/skills/test-audit),
with bundled guidance from [writing tests](https://github.com/openclaw/openclaw/blob/799b7a347c502912efb704b1722e117bc0a644ed/docs/help/testing/writing-tests.md),
[boundary scenarios](https://github.com/openclaw/openclaw/blob/799b7a347c502912efb704b1722e117bc0a644ed/docs/help/testing/boundary-scenarios.md)
and [testing proof policy](https://github.com/openclaw/openclaw/blob/799b7a347c502912efb704b1722e117bc0a644ed/.agents/skills/openclaw-testing/SKILL.md).
The installation layout follows [Ponytail](https://github.com/DietrichGebert/ponytail)'s
shared-skill/thin-adapter approach, without its hooks or persistent modes.

[MIT](LICENSE). The standalone skill also carries its own [license](skills/test-audit/LICENSE).
