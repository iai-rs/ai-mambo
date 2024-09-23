import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    ORACLE_S3_KEY_FILE_ENCODED: z.string(),
    ORACLE_S3_USER: z.string(),
    ORACLE_S3_TENANCY: z.string(),
    ORACLE_S3_FINGERPRINT: z.string(),
    ORACLE_NAMESPACE_NAME: z.string(),
    MINIO_SECRET_KEY: z.string(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_ENDPOINT: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    ORACLE_S3_KEY_FILE_ENCODED: process.env.ORACLE_S3_KEY_FILE_ENCODED,
    ORACLE_S3_USER: process.env.ORACLE_S3_USER,
    ORACLE_S3_TENANCY: process.env.ORACLE_S3_TENANCY,
    ORACLE_S3_FINGERPRINT: process.env.ORACLE_S3_FINGERPRINT,
    ORACLE_NAMESPACE_NAME: process.env.ORACLE_NAMESPACE_NAME,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
