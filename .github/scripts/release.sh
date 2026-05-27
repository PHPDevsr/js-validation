#!/usr/bin/env bash
set -euo pipefail

# Release script for js-validation
# Usage:
#   ./.github/release.sh [patch|minor|major]
#   ./.github/release.sh --from-tag vX.Y.Z

TYPE="${1:-patch}"
TAG_MODE=false
TAG_NAME=""

if [[ "$TYPE" == "--from-tag" ]]; then
  TAG_MODE=true
  TAG_NAME="${2:-}"
  if [[ -z "$TAG_NAME" || ! "$TAG_NAME" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Usage: $0 --from-tag vX.Y.Z"
    exit 1
  fi
elif [[ "$TYPE" != "patch" && "$TYPE" != "minor" && "$TYPE" != "major" ]]; then
  echo "Usage:"
  echo "  $0 [patch|minor|major]"
  echo "  $0 --from-tag vX.Y.Z"
  exit 1
fi

# Ensure we are on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" ]]; then
  echo "Error: releases must be created from the 'main' branch."
  echo "Current branch: $BRANCH"
  exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working directory is not clean. Commit or stash your changes first."
  exit 1
fi

# Bump/sync version in package metadata
if [[ "$TAG_MODE" == true ]]; then
  NEW_VERSION="$TAG_NAME"
  TARGET_VERSION="${NEW_VERSION#v}"
  CURRENT_VERSION=$(node --input-type=module -e "import fs from 'node:fs'; console.log(JSON.parse(fs.readFileSync('package.json', 'utf8')).version);")
  if [[ "$CURRENT_VERSION" != "$TARGET_VERSION" ]]; then
    echo "Error: package.json version ($CURRENT_VERSION) does not match tag version ($TARGET_VERSION)."
    exit 1
  fi
  echo "Package metadata already at $NEW_VERSION"
else
  NEW_VERSION=$(npm version "$TYPE" --no-git-tag-version)
  echo "Bumped version to $NEW_VERSION"
fi

# Update changelog
VERSION_NUMBER="${NEW_VERSION#v}"
RELEASE_DATE=$(date +%F)

TAG_MODE="$TAG_MODE" VERSION_NUMBER="$VERSION_NUMBER" RELEASE_DATE="$RELEASE_DATE" node --input-type=module <<'NODE'
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const changelogPath = 'CHANGELOG.md';
const version = process.env.VERSION_NUMBER;
const releaseDate = process.env.RELEASE_DATE;
const tagMode = process.env.TAG_MODE === 'true';

if (!version || !releaseDate) {
  console.error('Error: missing release metadata for changelog update.');
  process.exit(1);
}

const content = fs.readFileSync(changelogPath, 'utf8');
const unreleasedHeading = '## [Unreleased]';

if (!content.includes(unreleasedHeading)) {
  console.error(`Error: ${changelogPath} must contain "${unreleasedHeading}".`);
  process.exit(1);
}

let finalContent = content;
if (tagMode) {
  if (!content.includes(`## [${version}]`)) {
    console.error(`Error: ${changelogPath} is missing version ${version} in tag mode.`);
    process.exit(1);
  }
} else {
  const hasExistingVersion = content.includes(`## [${version}]`);
  if (hasExistingVersion) {
    console.error(`Error: ${changelogPath} already contains version ${version}.`);
    process.exit(1);
  }

  const lines = content.split('\n');
  const unreleasedIndex = lines.findIndex((line) => line.trim() === unreleasedHeading);
  if (unreleasedIndex === -1) {
    console.error(`Error: could not locate "${unreleasedHeading}" in ${changelogPath}.`);
    process.exit(1);
  }

  const nextVersionIndex = lines.findIndex(
    (line, index) => index > unreleasedIndex && /^## \[[^\]]+\]/.test(line)
  );
  const unreleasedBodyLines = lines.slice(
    unreleasedIndex + 1,
    nextVersionIndex === -1 ? lines.length : nextVersionIndex
  );

  const hasUnreleasedContent = unreleasedBodyLines.some((line) => line.trim().length > 0);

  let releaseNotes;
  if (hasUnreleasedContent) {
    releaseNotes = unreleasedBodyLines.join('\n').replace(/\s+$/, '');
  } else {
    // Auto-generate changelog entries from git commits since the last tag
    let lastTag = '';
    try {
      lastTag = execSync('git describe --tags --abbrev=0', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();
    } catch (_) {
      lastTag = '';
    }

    let commits = [];
    try {
      const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
      const log = execSync(`git log ${range} --pretty=format:%s --no-merges`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();
      commits = log ? log.split('\n').filter(Boolean) : [];
    } catch (_) {
      commits = [];
    }

    const added = commits.filter((c) => /^feat[:(]/.test(c));
    const changed = commits.filter((c) => /^(fix|refactor)[:(]/.test(c));
    const others = commits.filter((c) => !added.includes(c) && !changed.includes(c));

    const sections = [];
    if (added.length > 0) {
      sections.push(`### Added\n\n${added.map((c) => `- ${c}`).join('\n')}`);
    }
    if (changed.length > 0) {
      sections.push(`### Changed\n\n${changed.map((c) => `- ${c}`).join('\n')}`);
    }
    if (others.length > 0) {
      sections.push(`### Others\n\n${others.map((c) => `- ${c}`).join('\n')}`);
    }

    releaseNotes = sections.length > 0
      ? sections.join('\n\n')
      : '### Changed\n\n- No notable changes.';
  }

  const releaseSection = [`## [${version}] - ${releaseDate}`, '', releaseNotes, ''].join('\n');

  finalContent = [
    ...lines.slice(0, unreleasedIndex),
    unreleasedHeading,
    '',
    releaseSection.trimEnd(),
    '',
    ...(nextVersionIndex === -1 ? [] : lines.slice(nextVersionIndex))
  ].join('\n');

  const currentVersionHeadings = [
    ...finalContent.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)
  ].map((match) => match[1]);
  const previousVersion = currentVersionHeadings.find((v) => v !== version);
  const unreleasedRef = `[Unreleased]: https://github.com/PHPDevsr/js-validation/compare/v${version}...HEAD`;

  if (/^\[Unreleased\]: .*$/m.test(finalContent)) {
    finalContent = finalContent.replace(/^\[Unreleased\]: .*$/m, unreleasedRef);
  } else {
    finalContent = `${finalContent.replace(/\s*$/, '')}\n\n${unreleasedRef}\n`;
  }

  if (previousVersion) {
    const versionRef = `[${version}]: https://github.com/PHPDevsr/js-validation/compare/v${previousVersion}...v${version}`;
    const versionRefRegex = new RegExp(`^\\[${version.replace(/\./g, '\\.')}\\]: .*$`, 'm');
    if (versionRefRegex.test(finalContent)) {
      finalContent = finalContent.replace(versionRefRegex, versionRef);
    } else {
      finalContent = `${finalContent.replace(/\s*$/, '')}\n${versionRef}\n`;
    }
  }
}

fs.writeFileSync(changelogPath, finalContent.replace(/\n{3,}/g, '\n\n'));

const docsChangelogPath = 'docs-site/src/pages/changelog.md';
if (fs.existsSync(docsChangelogPath)) {
  const docsFrontmatter = [
    '---',
    'layout: ../layouts/DocsLayout.astro',
    'title: "Changelog"',
    'description: "Version history and release notes for js-validation."',
    '---',
    ''
  ].join('\n');

  const docsPageContent = `${docsFrontmatter}\n${finalContent.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
  fs.writeFileSync(docsChangelogPath, docsPageContent);
}
NODE
echo "Updated CHANGELOG.md and docs-site/src/pages/changelog.md"

# Commit and optionally create tag
if [[ "$TAG_MODE" == true ]]; then
  git add docs-site/src/pages/changelog.md
else
  git add package.json package-lock.json CHANGELOG.md docs-site/src/pages/changelog.md
fi

if [[ -n "$(git diff --cached --name-only)" ]]; then
  if [[ "$TAG_MODE" == true ]]; then
    git commit -m "chore: prepare release $NEW_VERSION"
  else
    git commit -m "chore: release $NEW_VERSION"
  fi
else
  echo "No release metadata changes to commit."
fi

if [[ "$TAG_MODE" == false ]]; then
  git tag "$NEW_VERSION"
fi

echo ""
echo "Release $NEW_VERSION is ready."
echo ""
if [[ "$TAG_MODE" == true ]]; then
  echo "Push to sync release metadata:"
  echo "  git push origin main"
else
  echo "Push to trigger the release pipeline:"
  echo "  git push origin main --tags"
  echo ""
  echo "This will:"
  echo "  1. Create a GitHub Release with build assets"
  echo "  2. Publish to NPM registry"
  echo "  3. Deploy docs and compiled JS to GitHub Pages"
fi
