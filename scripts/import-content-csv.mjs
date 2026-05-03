/**
 * One-off: imports Prisma/content export CSV into content/docs/widgets/*.mdx
 * Usage: node scripts/import-content-csv.mjs /path/to/content_rows.csv
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import YAML from "yaml";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/import-content-csv.mjs <content_rows.csv>");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const widgetsDir = path.join(root, "content", "docs", "widgets");

/** Clean invisible chars (e.g. ZWSP from exports) */
function clean(s) {
  return String(s ?? "")
    .replace(/\u200b/g, "")
    .trim();
}

function slugSegment(seg) {
  return String(seg || "")
    .trim()
    .replace(/_/g, "-");
}

/** Slug preserved path segments (`community/foo_bar` → `community/foo-bar`). */
function toSlug(name) {
  const n = clean(name);
  return n.split("/").map(slugSegment).join("/");
}

function inferType(name) {
  const tail = clean(name).split("/").pop() || "";
  if (/_architecture$/i.test(tail)) return "architecture";
  return "widget";
}

function parseDeps(raw) {
  const s = clean(raw);
  if (!s) return [];
  return JSON.parse(s);
}

function parseFiles(raw) {
  const s = clean(raw);
  if (!s) return [];
  const arr = JSON.parse(s);
  if (!Array.isArray(arr)) return [];
  return arr.map((f) => ({
    name: f.name,
    path: f.file_path,
    language: "dart",
    code: f.content ?? "",
  }));
}

function isValidHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const buf = fs.readFileSync(csvPath);
const rows = parse(buf, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_quotes: false,
  trim: false,
});

fs.mkdirSync(widgetsDir, { recursive: true });

const slugs = [];

for (const row of rows) {
  const name = clean(row.name);
  if (!name) continue;

  const slug = toSlug(name);
  slugs.push(slug);

  let dependencies = [];
  try {
    dependencies = parseDeps(row.dependencies);
  } catch (e) {
    console.warn(`[${name}] dependencies JSON parse failed, using []`, e.message);
  }

  let files = [];
  try {
    files = parseFiles(row.files);
  } catch (e) {
    console.warn(`[${name}] files JSON parse failed, using []`, e.message);
  }

  const previewRaw = clean(row.preview_url);
  const frontmatter = {
    title: clean(row.label) || name,
    description: clean(row.description) || "",
    type: inferType(name),
    ...(previewRaw && isValidHttpUrl(previewRaw)
      ? { preview_url: previewRaw }
      : {}),
    cli: `majestic_ui add ${name}`,
    dependencies,
    files,
  };

  const demo = clean(row.demo);
  const body = demo
    ? `## Demo\n\n\`\`\`dart\n${demo}\n\`\`\`\n`
    : "";

  const yamlBlock = YAML.stringify(frontmatter, {
    lineWidth: 0,
    defaultStringType: "BLOCK_LITERAL",
    defaultKeyType: "PLAIN",
  }).trimEnd();

  const mdx = `---\n${yamlBlock}\n---\n\n${body}`;
  const outFile = path.join(widgetsDir, `${slug}.mdx`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, mdx, "utf8");
  console.log("Wrote", path.relative(root, outFile));
}

const communityPaths = slugs.filter((s) => s.startsWith("community/"));
const topSlugs = slugs.filter((s) => !s.startsWith("community/"));

const topPages = [...topSlugs].sort();
if (communityPaths.length > 0) {
  topPages.push("community");
  topPages.sort();
}

if (communityPaths.length > 0) {
  const communityDir = path.join(widgetsDir, "community");
  fs.mkdirSync(communityDir, { recursive: true });
  const communityPages = communityPaths
    .map((s) => s.slice("community/".length))
    .sort();
  fs.writeFileSync(
    path.join(communityDir, "meta.json"),
    JSON.stringify(
      {
        title: "Community",
        pages: communityPages,
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

const metaPath = path.join(widgetsDir, "meta.json");
fs.writeFileSync(
  metaPath,
  JSON.stringify({ title: "Widgets", pages: topPages }, null, 2) + "\n",
  "utf8"
);
console.log(
  "Updated",
  path.relative(root, metaPath),
  `(${slugs.length} pages, ${topPages.length} top-level entries)`
);
