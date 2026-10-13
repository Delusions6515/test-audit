# Repository guide

## Package boundaries

- This repository distributes an instruction-only test-audit skill, not an application or test runner. Commands in the skill's testing guidance describe the project being audited; they are not this repository's development commands.
- `skills/test-audit/` is the single skill source for all hosts. Keep required references inside that directory so copying it alone remains usable. Its `LICENSE` is required for standalone distribution, even though the root also has one.
- Pi's resource declaration is in [package.json](package.json). Claude and Codex use `.claude-plugin/` and `.codex-plugin/`; `.agents/plugins/` contains the Codex marketplace, not another skill copy. Marketplace local sources resolve from the repository root, not the manifest's containing directory.
- The package's `files` whitelist excludes tests. Development checks require a source checkout, not an installed skill package.

## Verification

From the repository root, with Node.js available:

```sh
node --test tests/package.test.mjs
```

`npm test` invokes the same command. Tests use Node built-ins; dependency installation is not required. `package.json` defines no build, lint, formatter or type-check scripts, and there are no CI workflows.

For a focused native-manifest check:

```sh
node --test --test-name-pattern='native plugins' tests/package.test.mjs
```

[tests/package.test.mjs](tests/package.test.mjs) checks standalone references and licenses, frontmatter, Pi resources, plugin identity/version consistency and marketplace paths. Its link checker supports inline Markdown links and simple heading anchors; changes to reference syntax need corresponding checker coverage.

## Installation and behavior checks

Use [INSTALL.md](INSTALL.md) for host-specific installation, invocation and removal. Its user-level installation examples modify host configuration; they are not prerequisites for the offline tests.

[tests/scenarios.md](tests/scenarios.md) defines behavior and installation checks. Run installation experiments with temporary HOME, XDG and host configuration, not a normal user profile. Use synthetic fixtures without real credentials or production services.

## Completion

- After skill or distribution changes, run the package checks and keep [README.md](README.md) and [INSTALL.md](INSTALL.md) consistent with the affected entry points.
- For behavior changes, check the relevant scenarios separately. Package tests do not establish host discovery, model selection or compliance.
- Report which installation, discovery and behavior checks actually ran; label reading-only checks and unavailable hosts rather than presenting them as runtime verification.
