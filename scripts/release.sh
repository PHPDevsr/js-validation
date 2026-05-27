#!/usr/bin/env bash
set -euo pipefail

# Release script for js-validation
# Usage:
#   ./scripts/release.sh [patch|minor|major]
#   ./scripts/release.sh --from-tag vX.Y.Z

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
    npm version "$TARGET_VERSION" --no-git-tag-version
    echo "Synchronized package metadata to $NEW_VERSION"
  else
    echo "Package metadata already at $NEW_VERSION"
  fi
else
  NEW_VERSION=$(npm version "$TYPE" --no-git-tag-version)
  echo "Bumped version to $NEW_VERSION"
fi

# Update changelog
VERSION_NUMBER="${NEW_VERSION#v}"
RELEASE_DATE=$(date +%F)

ALLOW_EXISTING_VERSION="$TAG_MODE" VERSION_NUMBER="$VERSION_NUMBER" RELEASE_DATE="$RELEASE_DATE" node --input-type=module <<'NODE'
import fs from 'node:fs';

const changelogPath = 'CHANGELOG.md';
const version = process.env.VERSION_NUMBER;
const releaseDate = process.env.RELEASE_DATE;
const allowExistingVersion = process.env.ALLOW_EXISTING_VERSION === 'true';

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

if (content.includes(`## [${version}]`)) {
  if (allowExistingVersion) {
    console.log(`${changelogPath} already contains version ${version}; skipping changelog promotion.`);
    process.exit(0);
  }

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
const releaseNotes = hasUnreleasedContent
  ? unreleasedBodyLines.join('\n').replace(/\s+$/, '')
  : '### Changed\n\n- No notable changes.';

const releaseSection = [`## [${version}] - ${releaseDate}`, '', releaseNotes, ''].join('\n');

const updated = [
  ...lines.slice(0, unreleasedIndex),
  unreleasedHeading,
  '',
  releaseSection.trimEnd(),
  '',
  ...(nextVersionIndex === -1 ? [] : lines.slice(nextVersionIndex))
].join('\n');

let finalContent = updated;
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
git add package.json package-lock.json CHANGELOG.md docs-site/src/pages/changelog.md

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
