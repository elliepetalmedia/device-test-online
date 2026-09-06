import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  MODULE_ROUTES,
  SITE_ROUTES,
  SITE_URL,
  buildStructuredData,
  getRouteContent,
  getRouteDefinitionByTarget,
} from "../client/src/lib/site.ts";

const DIST_DIR = path.resolve(import.meta.dirname, "..", "dist", "public");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceOnce(
  html: string,
  pattern: RegExp,
  replacement: string | (() => string),
  label: string,
): string {
  if (!pattern.test(html)) {
    throw new Error(`Prerender: pattern not found for ${label}`);
  }
  return typeof replacement === "function"
    ? html.replace(pattern, replacement)
    : html.replace(pattern, replacement);
}

/** Crawlable static fallback. React clears #root on mount, so JS users
 *  never see this; no-JS crawlers get a real H1, description, key content,
 *  and internal links per URL. */
function buildRootFallback(routePath: string): string {
  const route = SITE_ROUTES.find((r) => r.path === routePath)!;
  const content = getRouteContent(route.target);
  const heading = escapeHtml(route.uiTitle ?? route.title);
  const description = escapeHtml(route.description);

  const blocks: string[] = [];
  if (content.interpretation) {
    blocks.push(
      `<h2>${escapeHtml(content.interpretation.title)}</h2>` +
        content.interpretation.paragraphs
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join(""),
    );
  }
  if (content.nextSteps) {
    blocks.push(
      `<h2>${escapeHtml(content.nextSteps.title)}</h2>` +
        content.nextSteps.paragraphs
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join(""),
    );
  }
  for (const section of content.guideSections ?? []) {
    blocks.push(
      `<h2>${escapeHtml(section.title)}</h2>` +
        (section.paragraphs ?? []).map((p) => `<p>${escapeHtml(p)}</p>`).join("") +
        (section.bullets
          ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
          : ""),
    );
  }

  const relatedTargets =
    content.relatedTargets ??
    MODULE_ROUTES.filter((r) => r.target !== "dashboard")
      .slice(0, 6)
      .map((r) => r.target);
  const links = relatedTargets
    .map((target) => {
      const related = getRouteDefinitionByTarget(target);
      return `<li><a href="${escapeHtml(related.path)}">${escapeHtml(related.uiTitle ?? related.title)}</a></li>`;
    })
    .join("");

  return (
    `<div id="root"><article>` +
    `<h1>${heading}</h1><p>${description}</p>` +
    blocks.join("") +
    `<nav aria-label="Related tests"><ul>${links}</ul></nav>` +
    `</article></div>`
  );
}

function renderRouteHtml(template: string, routePath: string): string {
  const route = SITE_ROUTES.find((r) => r.path === routePath)!;
  const canonicalUrl = `${SITE_URL}${route.path}`;
  const robots = route.indexable ? "index,follow" : "noindex,nofollow";
  const schema = JSON.stringify(buildStructuredData(route.path)).replace(
    /<\//g,
    "<\\/",
  );

  let html = template;
  html = replaceOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`,
    "title",
  );
  html = replaceOnce(
    html,
    /<meta\s+name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    "meta description",
  );
  html = replaceOnce(
    html,
    /<meta\s+name="robots"[^>]*>/,
    `<meta name="robots" content="${robots}" />`,
    "meta robots",
  );
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    "canonical",
  );
  html = replaceOnce(
    html,
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    "og:title",
  );
  html = replaceOnce(
    html,
    /<meta\s+property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    "og:description",
  );
  html = replaceOnce(
    html,
    /<meta\s+property="og:url"[^>]*>/,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    "og:url",
  );
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    "twitter:title",
  );
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    "twitter:description",
  );
  html = replaceOnce(
    html,
    /<\/head>/,
    `    <script type="application/ld+json">${schema}</script>\n  </head>`,
    "json-ld",
  );
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    () => buildRootFallback(route.path),
    "#root fallback",
  );
  return html;
}

function refreshSitemapLastmod(): void {
  const sitemapPath = path.join(DIST_DIR, "sitemap.xml");
  let xml: string;
  try {
    xml = readFileSync(sitemapPath, "utf8");
  } catch {
    console.warn("Prerender: sitemap.xml not found, skipping lastmod refresh.");
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  xml = xml.replace(/<url>\s*(?:<lastmod>.*?<\/lastmod>\s*)?<loc>/g, `<url><lastmod>${today}</lastmod><loc>`);
  writeFileSync(sitemapPath, xml);
  console.log(`Prerender: refreshed sitemap lastmod to ${today}.`);
}

let template: string;
try {
  template = readFileSync(TEMPLATE_PATH, "utf8");
} catch {
  throw new Error(
    "Prerender: dist/public/index.html not found. Run `vite build` first.",
  );
}

for (const route of SITE_ROUTES) {
  const html = renderRouteHtml(template, route.path);
  const outPath =
    route.path === "/"
      ? TEMPLATE_PATH
      : path.join(DIST_DIR, route.path.slice(1), "index.html");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`Prerender: ${route.path} -> ${path.relative(DIST_DIR, outPath)}`);
}

refreshSitemapLastmod();
console.log(`Prerender: done (${SITE_ROUTES.length} routes).`);
