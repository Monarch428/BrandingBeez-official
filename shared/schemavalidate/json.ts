// shared/schema/json.ts
import { z } from "zod";

export const jsonValueSchema: z.ZodType<unknown> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.lazy(() => jsonValueSchema)),
  z.record(z.lazy(() => jsonValueSchema)),
]);
