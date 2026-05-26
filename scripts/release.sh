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

# Commit and tag
git add package.json package-lock.json
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
