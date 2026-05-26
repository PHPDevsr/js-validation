#!/usr/bin/env bash
set -euo pipefail

# Release script for js-validation
# Usage: ./scripts/release.sh [patch|minor|major]
# Example: ./scripts/release.sh patch  → 1.0.0 → 1.0.1

TYPE="${1:-patch}"

if [[ "$TYPE" != "patch" && "$TYPE" != "minor" && "$TYPE" != "major" ]]; then
  echo "Usage: $0 [patch|minor|major]"
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

# Bump version in package.json (creates git tag automatically)
NEW_VERSION=$(npm version "$TYPE" --no-git-tag-version)
echo "Bumped version to $NEW_VERSION"

# Update changelog
VERSION_NUMBER="${NEW_VERSION#v}"
RELEASE_DATE=$(date +%F)

VERSION_NUMBER="$VERSION_NUMBER" RELEASE_DATE="$RELEASE_DATE" node --input-type=module <<'NODE'
import fs from 'node:fs';

const changelogPath = 'CHANGELOG.md';
const version = process.env.VERSION_NUMBER;
const releaseDate = process.env.RELEASE_DATE;

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
NODE
echo "Updated CHANGELOG.md"

# Commit and tag
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release $NEW_VERSION"
git tag "$NEW_VERSION"

echo ""
echo "Release $NEW_VERSION is ready."
echo ""
echo "Push to trigger the release pipeline:"
echo "  git push origin main --tags"
echo ""
echo "This will:"
echo "  1. Create a GitHub Release with build assets"
echo "  2. Publish to NPM registry"
echo "  3. Deploy docs and compiled JS to GitHub Pages"
