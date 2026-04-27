import React from "react";

import { PublicInfoPageLayout } from "@/components/PublicInfoPageLayout";
import { Card } from "@/components/ui/card";
import { getRouteContent, type GuideTarget } from "@/lib/site";

export default function GuidePage({ target }: { target: GuideTarget }) {
  const content = getRouteContent(target);

  return (
    <PublicInfoPageLayout target={target}>
      <div className="space-y-6">
        {content.guideSections?.map((section) => (
          <Card key={section.title} className="border-primary/20 bg-surface p-6">
            <h2 className="mb-3 font-orbitron text-xl text-white">{section.title}</h2>
            <div className="space-y-4 text-muted-foreground">
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </PublicInfoPageLayout>
  );
}
