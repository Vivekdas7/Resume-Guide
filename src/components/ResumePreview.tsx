import React from "react";
import { SimpleTemplate } from "./resume-templates/SimpleTemplate";
import { SplitTemplate } from "./resume-templates/SplitTemplate";
import { ModernTemplate } from "./resume-templates/ModernTemplate";
import { CreativeTemplate } from "./resume-templates/CreativeTemplate";
import { TimelineTemplate } from "./resume-templates/TimelineTemplate";

export const ResumePreview = ({ data, templateName = "simple" }: { data: any; templateName?: string }) => {
  switch (templateName) {
    case "simple":
      return <SimpleTemplate data={data} />;
    case "split":
      return <SplitTemplate data={data} />;
    case "modern":
      return <ModernTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    case "timeline":
      return <TimelineTemplate data={data} />;
    default:
      return <SimpleTemplate data={data} />;
  }
};