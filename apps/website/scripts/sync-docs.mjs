import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    // Skip markdown pages; we'll handle them separately
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function listMarkdownFiles(root) {
  const results = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === ".DS_Store") continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(root, full);
      if (entry.isDirectory()) {
        // Skip images and other asset folders
        if (entry.name.toLowerCase() === "images") continue;
        await walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        results.push(rel);
      }
    }
  }
  await walk(root);
  return results;
}

async function main() {
  const websiteRoot = path.resolve(__dirname, "..");
  const repoDocs = path.resolve(websiteRoot, "../../docs");
  const publicDocs = path.resolve(websiteRoot, "public/docs");
  const pagesDir = path.resolve(websiteRoot, "src/pages");

  try {
    await fs.stat(repoDocs);
  } catch {
    console.warn(`[sync-docs] Source docs not found at ${repoDocs}`);
    return;
  }

  await copyDir(repoDocs, publicDocs);
  console.log(
    `[sync-docs] Synced docs -> ${path.relative(websiteRoot, publicDocs)}`,
  );

  // Generate pages for every markdown in each locale
  const langs = ["en", "ja", "ko"];
  for (const lang of langs) {
    const langDocsDir = path.join(repoDocs, lang);
    try {
      await fs.stat(langDocsDir);
    } catch {
      console.warn(
        `[sync-docs] Skip lang: not found ${path.relative(websiteRoot, langDocsDir)}`,
      );
      continue;
    }
    const mdFiles = await listMarkdownFiles(langDocsDir);
    for (const rel of mdFiles) {
      const srcMd = path.join(langDocsDir, rel);
      const withoutExt = rel.replace(/\.md$/i, "");
      const outDir = path.join(
        pagesDir,
        lang === "en"
          ? path.join("docs", path.dirname(withoutExt))
          : path.join("docs", lang, path.dirname(withoutExt)),
      );
      const outPath = path.join(outDir, path.basename(withoutExt) + ".md");
      await fs.mkdir(outDir, { recursive: true });

      let raw = await fs.readFile(srcMd, "utf-8");
      // Extract title from first markdown H1 if present
      const m = raw.match(/^#\s+(.+)$/m);
      const titleFromH1 = m ? m[1].trim() : path.basename(withoutExt);

      // Rewrite relative image links to served copies under /public/docs.
      // Matches ](images/... | ./images/... | ../images/... etc)
      raw = raw.replace(
        /\]\((?:\.?\.\/?)*images\//g,
        `](/a11y-visualizer/docs/${lang}/images/`,
      );

      // Compute relative path to docs layout from outDir
      const layoutAbs = path.resolve(
        websiteRoot,
        "src/layouts/DocsLayout.astro",
      );
      let layoutRel = path
        .relative(outDir, layoutAbs)
        .split(path.sep)
        .join("/");
      if (!layoutRel.startsWith(".")) layoutRel = "./" + layoutRel;

      const frontmatter = `---\nlayout: ${layoutRel}\nlang: ${lang}\ntitle: ${titleFromH1}\n---\n\n`;
      await fs.writeFile(outPath, frontmatter + raw, "utf-8");
      console.log(`[sync-docs] Wrote ${path.relative(websiteRoot, outPath)}`);
    }
  }
}

main().catch((err) => {
  console.error("[sync-docs] Failed:", err);
  process.exit(1);
});
