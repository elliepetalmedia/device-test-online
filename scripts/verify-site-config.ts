import {
  MODULE_ROUTES,
  ROUTE_CONTENT,
  SITE_ROUTES,
  buildStructuredData,
  getRouteContent,
  getRouteDefinitionByTarget,
  type ModuleType,
} from "../client/src/lib/site.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function verifyUniqueRoutes() {
  const paths = new Set<string>();
  const targets = new Set<string>();

  for (const route of SITE_ROUTES) {
    assert(!paths.has(route.path), `Duplicate route path found: ${route.path}`);
    assert(!targets.has(route.target), `Duplicate route target found: ${route.target}`);
    paths.add(route.path);
    targets.add(route.target);
  }
}

function verifyRelatedTargets() {
  for (const [target, content] of Object.entries(ROUTE_CONTENT)) {
    const relatedTargets = content?.relatedTargets ?? [];
    for (const relatedTarget of relatedTargets) {
      assert(
        MODULE_ROUTES.some((route) => route.target === relatedTarget),
        `Route content for ${target} references unknown related target ${relatedTarget}`,
      );
    }
  }
}

function verifyStructuredData() {
  const expectations: Array<{
    path: string;
    expectedType: string;
    expectedName: string;
  }> = [
    {
      path: "/",
      expectedType: "CollectionPage",
      expectedName: getRouteDefinitionByTarget("dashboard").title,
    },
    {
      path: "/microphone-test",
      expectedType: "SoftwareApplication",
      expectedName: getRouteDefinitionByTarget("mic").title,
    },
    {
      path: "/faq",
      expectedType: "FAQPage",
      expectedName: getRouteDefinitionByTarget("faq").title,
    },
    {
      path: "/privacy",
      expectedType: "WebPage",
      expectedName: getRouteDefinitionByTarget("privacy").title,
    },
  ];

  for (const expectation of expectations) {
    const schema = buildStructuredData(expectation.path) as {
      "@type"?: string;
      name?: string;
      url?: string;
      description?: string;
    };

    assert(schema["@type"] === expectation.expectedType, `Unexpected schema type for ${expectation.path}`);
    assert(schema.name === expectation.expectedName, `Unexpected schema name for ${expectation.path}`);
    assert(typeof schema.url === "string" && schema.url.length > 0, `Missing schema url for ${expectation.path}`);
    assert(
      typeof schema.description === "string" && schema.description.length > 0,
      `Missing schema description for ${expectation.path}`,
    );
  }
}

function verifyCtaTargets() {
  for (const route of SITE_ROUTES) {
    const content = getRouteContent(route.target);
    const ctas = [content.primaryCta, content.secondaryCta].filter(Boolean);
    for (const cta of ctas) {
      assert(cta, `Invalid CTA config for ${route.target}`);
      assert(
        SITE_ROUTES.some((candidate) => candidate.target === cta.target),
        `CTA on ${route.target} points to missing target ${cta.target}`,
      );
    }
  }
}

function verifyModuleCoverage() {
  const liveModules = new Set<ModuleType>(
    MODULE_ROUTES.filter((route) => route.target !== "dashboard").map((route) => route.target),
  );

  for (const moduleTarget of Array.from(liveModules)) {
    assert(
      getRouteContent(moduleTarget).schemaKind === "diagnostic",
      `Expected diagnostic schema config for module ${moduleTarget}`,
    );
  }
}

verifyUniqueRoutes();
verifyRelatedTargets();
verifyStructuredData();
verifyCtaTargets();
verifyModuleCoverage();

console.log("Site configuration verification passed.");
