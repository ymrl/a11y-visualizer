import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import semver from "semver";

const releaseLevel = process.argv[2];

if (
  releaseLevel !== "major" &&
  releaseLevel !== "minor" &&
  releaseLevel !== "patch"
) {
  // eslint-disable-next-line no-console
  console.error(
    "Invalid release level. Please use one of major, minor, or patch",
  );
  process.exit(1);
}

const currentVersion = execSync(
  "node -e \"console.log(require('./package.json').version)\"",
)
  .toString()
  .trim();
const nextVersion = semver.inc(currentVersion, releaseLevel);

// Update manifest.json
const manifest = JSON.parse(readFileSync("./manifest.json", "utf8"));
manifest.version = nextVersion;
writeFileSync("./manifest.json", JSON.stringify(manifest, null, 2));
execSync("npx prettier --write manifest.json");
execSync("git add manifest.json");
execSync(`git commit -m ":up: update manifest.json to v${nextVersion}"`);

// Update package.json
execSync(`npm version ${releaseLevel}`);
