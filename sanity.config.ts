import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // "Vision" lets you run raw GROQ queries inside Studio — handy for
    // debugging, safe to leave in for a small team.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
