# Installation

Every route loads the same `skills/test-audit/` directory. There are no hooks,
background services, runtime scripts or persistent modes. Choose one route per
host to avoid duplicate skills. Review skills before granting project trust.

Remote commands require a repository revision that contains the skill files.
For a local checkout, use the local commands below. Run commands that reference
`./test-audit` from the directory containing that checkout.

## Pi

### Package installation

```sh
pi install git:github.com/Delusions6515/test-audit
```

For a local checkout:

```sh
pi install ./test-audit
```

These are user installs. Add `--local` for a project-scoped package declaration;
review the package before granting project trust. Local packages are loaded in
place, so keep the checkout at the same path.

Start a session or run `/reload`, then invoke:

```text
/skill:test-audit audit the storage tests
```

`pi list` confirms the package declaration; startup diagnostics and the skill
command confirm discovery. Removal uses the original source:

```sh
pi remove git:github.com/Delusions6515/test-audit
pi remove ./test-audit
```

Remove only the source you installed, with `--local` if it was project-scoped.
Directory installation is also supported; see the manual-copy table below.

## Claude Code

### Native plugin

```sh
claude plugin marketplace add Delusions6515/test-audit
claude plugin install test-audit@test-audit
```

For a local checkout, replace the first command with:

```sh
claude plugin marketplace add ./test-audit
```

The second command is unchanged. Restart the session or reload plugins, then use
`/test-audit:test-audit`. The first name is the plugin namespace; the second is
the skill name. Use `claude plugin list` or `/plugin` to inspect installation.

Remove the plugin and, if no longer needed, its marketplace:

```sh
claude plugin uninstall test-audit@test-audit
claude plugin marketplace remove test-audit
```

### Skill-only installation

Use the Skills CLI below with `-a claude-code`, or copy the directory to
`.claude/skills/` or `~/.claude/skills/`. Invoke this unnamespaced version with
`/test-audit`. Do not also enable the native plugin.

## Codex

### Skill-only installation

```sh
npx skills add Delusions6515/test-audit --skill test-audit -a codex -g
```

Restart Codex if it has not discovered the new skill. Select `test-audit` with
`/skills` or mention `$test-audit` in your prompt. This route also works without
a plugin interface.

### Native marketplace

For clients supporting OpenAI's current plugin format:

```sh
codex plugin marketplace add Delusions6515/test-audit
```

For a local checkout:

```sh
codex plugin marketplace add ./test-audit
```

Registration adds a catalog; it is not proof that the plugin is installed or
loaded. In the ChatGPT desktop app's supported Codex/Work plugin interface,
restart or refresh the app, choose the **Test Audit** marketplace in the Plugins
Directory, and install **test-audit**. Use the host's skill selector to confirm
the bundled skill and its displayed invocation name. UI availability and plugin
commands vary by client version; use the skill-only route if unavailable.

Uninstall the plugin in the same interface. Remove the catalog with:

```sh
codex plugin marketplace remove test-audit
```

The package uses the supported `.codex-plugin/plugin.json` compatibility layout.
Both native manifests refer to the same root `skills/`; no second skill copy is
maintained.

## Cursor

```sh
npx skills add Delusions6515/test-audit --skill test-audit -a cursor -g
```

Open **Customize → Skills** to confirm discovery. In Agent chat, type `/` and
select `test-audit`, then append the task. Reload the window if necessary.
Manual `.agents/skills/` and `.cursor/skills/` directories are supported too.

This repository does not supply a Cursor plugin marketplace. Do not use Cursor's
**From GitHub Repository** plugin-import flow for this skill-only package.
User-directory installation covers the local client; remote/cloud environments
need skills installed in their own environment or the target repository.

## Skills CLI: all four hosts

The existing [Skills CLI](https://github.com/vercel-labs/skills) handles the
installation; this repository adds no installer. Its own Node requirements are
separate from the skill's, which has no runtime dependencies.

Use one of `pi`, `claude-code`, `codex`, or `cursor` as the agent name. Example:

```sh
npx skills add Delusions6515/test-audit --skill test-audit -a pi -g
```

For a local checkout:

```sh
npx skills add ./test-audit --skill test-audit -a pi -g
```

Omit `-g` to install into the current target project. Add `--copy` if you prefer
an independent copy instead of the installer's default symlinks. After installing,
check discovery in the actual host, not only the installer's success message.

Remove a user installation with:

```sh
npx skills remove test-audit -a pi -g
```

Replace `pi` with the host you installed for. Omit `-g` for project installation.
Use this same tool to remove tool-managed copies and links.

## Manual directory copy

Copy the **whole** `skills/test-audit/` directory, including references and
LICENSE, into one of these roots:

| Host | Project root | User root |
| --- | --- | --- |
| Pi | `.agents/skills/` | `~/.agents/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.cursor/skills/` or `.agents/skills/` | `~/.cursor/skills/` or `~/.agents/skills/` |

For example, from this repository root, for a user-level Pi or Codex install:

```sh
mkdir -p ~/.agents/skills
cp -R skills/test-audit ~/.agents/skills/
```

Do not overwrite an existing same-name skill blindly. Shared `.agents/skills/`
locations can be read by multiple hosts; do not duplicate the same skill in a
second supported directory. Restart/reload the host and use its invocation above.
To uninstall a manual copy, delete only the `test-audit/` directory you copied.
No hook configuration or mode state needs cleanup.

## What verification means

- A valid manifest establishes structure, not a working native installation.
- An installer success and readable files establish installation, not host discovery.
- A discovered skill establishes loading, not model selection or compliance.
- Actual behavior requires a task run in that host. See the
  [source-checkout scenarios](https://github.com/Delusions6515/test-audit/blob/main/tests/scenarios.md).

## Host documentation

- [Pi skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md)
  and [packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md)
- [Claude Code skills](https://code.claude.com/docs/en/skills) and
  [plugins](https://code.claude.com/docs/en/plugins-reference)
- [Codex skills](https://developers.openai.com/codex/skills) and
  [plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Cursor skills](https://cursor.com/docs/context/skills)
