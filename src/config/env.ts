import "server-only";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: isProduction
    ? z.string().min(32, "AUTH_SECRET must be at least 32 characters in production")
    : z.string().min(16, "AUTH_SECRET must be at least 16 characters").optional(),
  EMAIL_FROM: z.string().min(3).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
});

function loadEnv() {
  if (process.env.SKIP_ENV_VALIDATION === "1") {
    return envSchema.partial().parse(process.env) as z.infer<typeof envSchema>;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}\nSee .env.example.`);
  }
  return parsed.data;
}

const raw = loadEnv();

/** Validated server environment. Import only from server code. */
export const env = {
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === "production",
  appUrl: raw.NEXT_PUBLIC_APP_URL,
  databaseUrl: raw.DATABASE_URL,
  authSecret: raw.AUTH_SECRET,
  email: {
    from: raw.EMAIL_FROM,
    resendApiKey: raw.RESEND_API_KEY,
  },
} as const;
