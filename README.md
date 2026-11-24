# Sentinel console

Sentinel is a fictional security console. This app is built only from [Bastion](https://github.com/vineethbangera/bastion-ds) components: `@vineethbangera/ui` and `@vineethbangera/tokens`, installed from GitHub Packages.

## Getting started

GitHub Packages needs a token to install, even for public packages (see below). If you use the GitHub CLI, its login token works once it has the `read:packages` scope:

```bash
gh auth refresh -s read:packages   # once
export NODE_AUTH_TOKEN=$(gh auth token)
npm install
npm run dev
```

`.npmrc` reads the token from `NODE_AUTH_TOKEN`, so it's never written to a file in the repo.

Add `?demo=empty` to the URL to see the Alerts page with no alerts.

## Why GitHub Packages needs a token

npmjs.com lets anyone download a public package anonymously. GitHub Packages' npm registry doesn't: every request has to be signed in with a token that can read packages, whether the package is public or private. "Public" there means any GitHub account may read it, not that no account is needed. One registry serves public and private packages under the same rules, and every download is tied to an account. So any machine that installs Bastion, including CI and Dependabot, needs a GitHub token with `read:packages`.

## Bastion upgrades

Dependabot checks for new Bastion versions every day and opens one pull request that upgrades `@vineethbangera/ui` and `@vineethbangera/tokens` together. Bastion's changelog is in its [releases](https://github.com/vineethbangera/bastion-ds/releases). Under semantic versioning, a patch or minor upgrade shouldn't need code changes here; a major one may.
