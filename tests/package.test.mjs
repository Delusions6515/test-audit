import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skill = join(root, 'skills/test-audit');
const read = (path) => readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(join(root, path)));

function checkLicense(directory) {
  const text = read(join(directory, 'LICENSE'));
  for (const required of [
    'MIT License',
    'Copyright (c) 2026 Delusions6515',
    'Copyright (c) 2026 OpenClaw Foundation',
    `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:`,
    `The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.`,
    `THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  ]) assert.ok(text.replace(/\s+/g, ' ').includes(required.replace(/\s+/g, ' ')), `Incomplete MIT license: ${required}`);
}

function checkSkill(directory) {
  const base = realpathSync(directory);
  const main = read(join(base, 'SKILL.md'));
  const frontmatter = main.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  assert.ok(frontmatter, 'Missing skill frontmatter');
  assert.match(frontmatter, /^name: test-audit\s*$/m);
  const description = frontmatter.match(/^description:[ \t]*(.*)$/m)?.[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim();
  assert.ok(description, 'Missing skill description');
  checkLicense(base);

  // These documents are the skill's public, progressively loaded entry points.
  const pending = [join(base, 'SKILL.md'), join(base, 'CAMPAIGN.md'), join(base, 'references/audit.md'), join(base, 'references/testing.md'), join(base, 'references/validation.md')];
  const visited = new Set();
  for (const file of pending) {
    if (visited.has(file)) continue;
    visited.add(file);
    const text = read(file);
    // shortcut: inline links and simple heading anchors only; use an existing Markdown validator if the syntax expands.
    for (const [, link] of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      if (/^https?:\/\//.test(link)) continue;
      const [path, fragment] = link.split('#');
      assert.ok(!isAbsolute(path) && !/^[a-z]+:/i.test(path), `External local reference: ${link}`);
      const target = resolve(dirname(file), path || file);
      const inside = relative(base, target);
      assert.ok(inside !== '..' && !inside.startsWith(`..${sep}`) && !isAbsolute(inside), `Reference escapes skill: ${link}`);
      assert.ok(existsSync(target), `Missing reference: ${link}`);
      const physical = relative(base, realpathSync(target));
      assert.ok(physical !== '..' && !physical.startsWith(`..${sep}`) && !isAbsolute(physical), `Reference escapes skill: ${link}`);
      const contents = read(target);
      if (fragment) {
        const headings = [...contents.matchAll(/^#{1,6} (.+)$/gm)].map(([, heading]) => heading.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-'));
        assert.ok(headings.includes(fragment) || contents.includes(`id="${fragment}"`), `Missing anchor: ${link}`);
      }
      if (target.endsWith('.md')) pending.push(target);
    }
  }
}

function isolatedSkill(t) {
  const temporary = mkdtempSync(join(tmpdir(), 'test-audit-package-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const directory = join(temporary, 'test-audit');
  cpSync(skill, directory, { recursive: true });
  return directory;
}

test('skill works as a standalone directory with its own license and references', (t) => {
  checkSkill(isolatedSkill(t));
  checkLicense(root);
});

test('a skill description cannot be empty', (t) => {
  const directory = isolatedSkill(t);
  const original = read(join(directory, 'SKILL.md'));
  for (const value of ['""', "''", ' ']) {
    writeFileSync(join(directory, 'SKILL.md'), original.replace(/^description: .+$/m, `description: ${value}`));
    assert.throws(() => checkSkill(directory), /Missing skill description/);
  }
});

test('a missing reference fails at the referenced file', (t) => {
  const directory = isolatedSkill(t);
  rmSync(join(directory, 'references/testing.md'));
  assert.throws(() => checkSkill(directory), /Missing reference: references\/testing\.md/);
});

test('a reference cannot depend on a file outside the skill', (t) => {
  const directory = isolatedSkill(t);
  writeFileSync(join(directory, 'SKILL.md'), `${read(join(directory, 'SKILL.md'))}\n[Outside](../outside.md)\n`);
  writeFileSync(join(directory, '../outside.md'), '# Outside\n');
  assert.throws(() => checkSkill(directory), /Reference escapes skill: \.\.\/outside\.md/);
});

test('a reference must reach a real anchor', (t) => {
  const directory = isolatedSkill(t);
  writeFileSync(join(directory, 'SKILL.md'), `${read(join(directory, 'SKILL.md'))}\n[Invalid](references/testing.md#missing-anchor)\n`);
  assert.throws(() => checkSkill(directory), /Missing anchor: references\/testing\.md#missing-anchor/);
});

test('a standalone copy must retain the complete MIT notice', (t) => {
  const directory = isolatedSkill(t);
  const original = read(join(directory, 'LICENSE'));
  for (const incomplete of ['MIT License\n', original.replace('FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. ', '')]) {
    writeFileSync(join(directory, 'LICENSE'), incomplete);
    assert.throws(() => checkSkill(directory), /Incomplete MIT license/);
  }
});

test('Pi package points at the shared skill and has no runtime or install code', () => {
  const pkg = json('package.json');
  assert.ok(pkg.private);
  assert.ok(pkg.keywords.includes('pi-package'));
  assert.deepEqual(pkg.pi.skills, ['skills']);
  assert.ok(pkg.files.includes('skills/'));
  assert.ok(pkg.files.includes('LICENSE'));
  assert.ok(!pkg.dependencies && !pkg.optionalDependencies && !pkg.bin);
  for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) assert.ok(!pkg.scripts?.[hook]);
});

test('native plugins distribute the same skill without executable components', () => {
  const pkg = json('package.json');
  const claude = json('.claude-plugin/plugin.json');
  const codex = json('.codex-plugin/plugin.json');
  for (const manifest of [claude, codex]) {
    assert.equal(manifest.name, 'test-audit');
    assert.equal(manifest.version, pkg.version);
    for (const key of ['hooks', 'mcpServers', 'lspServers', 'commands', 'agents', 'apps']) assert.ok(!manifest[key], `Unexpected component: ${key}`);
    if (manifest.skills) assert.equal(realpathSync(resolve(root, manifest.skills)), realpathSync(join(root, 'skills')));
  }
  assert.equal(codex.skills, './skills/');
  const cm = json('.claude-plugin/marketplace.json');
  const xm = json('.agents/plugins/marketplace.json');
  assert.ok(cm.owner.name);
  for (const [marketplace, manifest] of [[cm, claude], [xm, codex]]) {
    assert.equal(marketplace.plugins.length, 1);
    const entry = marketplace.plugins[0];
    assert.equal(entry.name, manifest.name);
    const source = typeof entry.source === 'string' ? entry.source : entry.source.path;
    assert.equal(realpathSync(resolve(root, source)), realpathSync(root));
    if (entry.version) assert.equal(entry.version, pkg.version);
  }
  assert.equal(xm.plugins[0].source.source, 'local');
  assert.equal(xm.plugins[0].policy.installation, 'AVAILABLE');
  assert.equal(xm.plugins[0].policy.authentication, 'ON_INSTALL');
  assert.ok(xm.plugins[0].category);
});
