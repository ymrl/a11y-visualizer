# Release Process

This repository uses [Changesets](https://github.com/changesets/changesets) to
manage versions of the browser extension and the packages in `packages/`.

## Day-to-day development

When you open a pull request that contains user-facing changes, add a
changeset describing them:

```bash
pnpm changeset
```

The interactive prompt asks which packages are affected and whether the change
is `patch` / `minor` / `major`, then writes a markdown file into `.changeset/`.
Commit that file together with your changes.

Notes:

- Changes that do not affect any released artifact (CI, docs, website) do not
  need a changeset.
- `@a11y-visualizer/browser-extension` depends on the `packages/*` packages
  with `workspace:*`, so bumping a package automatically bumps the extension
  as well (as a `patch`, via `updateInternalDependencies`). Select the
  extension explicitly only when you want a `minor` or `major` bump for it.
- `@a11y-visualizer/website` is excluded from versioning (listed in
  `ignore` in `.changeset/config.json`).

## Releasing

1. When changesets exist on `main`, the Release Workflow
   (`.github/workflows/release.yml`) automatically creates or updates a
   **"Version Packages"** pull request. It applies all pending changesets:
   package versions are bumped and `CHANGELOG.md` files are updated.
   (This PR exists because pushing directly to `main` is restricted.)
2. Since the PR is created with `GITHUB_TOKEN`, regular PR workflows do not
   run on it. Instead, the Release Workflow runs `lint` / `test` / `build` /
   `build_website` against the PR's head commit and reports commit statuses.
3. Review and merge the "Version Packages" PR.
4. On the push to `main`, the Release Workflow detects that the browser
   extension version has no `v*` tag yet, builds the extension zips
   (`pnpm zip` / `pnpm zip:firefox`), creates the `v<version>` tag, and
   creates a **draft GitHub Release** with the zip files attached.
5. Review the draft release, publish it, and upload the zip files to the
   browser extension stores.

## Publishing packages to npm (future)

The packages in `packages/` are not published yet, and are marked
`"private": true` so that Changesets versions them without publishing.
To start publishing a package:

1. Remove `"private": true` from its `package.json` (and make sure `files`,
   `exports`, build outputs, etc. are ready for publishing).
2. Add a publish step to the Release Workflow by passing a `publish` command
   to `changesets/action` (e.g. `pnpm changeset publish`) and providing an
   `NPM_TOKEN` secret.

`access: "public"` is already configured in `.changeset/config.json`, so
scoped packages will be published publicly once the steps above are done.

## Repository settings the workflow depends on

- **Settings → Actions → General → Allow GitHub Actions to create and approve
  pull requests** must be enabled (required for the "Version Packages" PR).
- If branch protection on `main` requires status checks, the contexts
  `lint`, `test`, `build`, and `build_website` are provided for the
  "Version Packages" PR by the Release Workflow itself.
