import { z } from "zod";

export const appContextSchema = z.object({
  configuredProviders: z.array(z.string()),
  disableContinue: z.boolean(),
  title: z.string(),
  genericName: z.string(),
  domain: z.string(),
  forgotPasswordMessage: z.string(),
  oauthAutoRedirect: z.enum(["none", "github", "google", "generic"]),
  backgroundImage: z.string(),
  authButtonColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .catch("#99ccff"),
});

export type AppContextSchema = z.infer<typeof appContextSchema>;
