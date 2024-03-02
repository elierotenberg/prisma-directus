import { z } from "zod";

import { ConditionDictionary } from "@/generator/lib/Generator/Condition";
import { FilterDictionary } from "@/generator/lib/Generator/Filter";
import { RichTextCustomSyntax } from "@/generator/lib/Generator/RichTextCustomSyntax";

const GeneratorConfig = z
  .object({
    banner: z
      .string()
      .default(
        `# This file was generated by Prisma Directus Generator. Do not edit manually.`,
      ),
    conditions: ConditionDictionary.default({}),
    debugFile: z.string().optional(),
    directivePrefix: z.string().default(`@`),
    directus: z.string(),
    filters: FilterDictionary.default({}),
    permissionsFile: z.string().default(`./directus-permissions.yml`),
    richTextCustomSyntaxes: z.array(RichTextCustomSyntax).default([]),
    roles: z.record(
      z
        .object({
          id: z.string().uuid().nullable(),
        })
        .strict(),
    ),
    snapshotFile: z.string().default(`./directus-snapshot.yml`),
    version: z.number().int().nonnegative(),
  })
  .strict();
type GeneratorConfig = z.infer<typeof GeneratorConfig>;

export { GeneratorConfig };
