function getEnvVar(key: string, side: "server" | "client"): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing ${side}-side environment variable: ${key}\n` +
        `Please add it to your .env.local file.`,
    );
  }

  return value;
}

function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

export const serverEnv = {
  supabase: {
    url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "server"),
    publishableKey: getEnvVar("NEXT_PUBLIC_SUPABASE_KEY", "server"),
  },

  app: {
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "server"),
  },

  nodeEnv: getOptionalEnvVar("NODE_ENV") ?? "development",
} as const;

export const clientEnv = {
  supabase: {
    url: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "client"),
    publishableKey: getEnvVar("NEXT_PUBLIC_SUPABASE_KEY", "client"),
  },
  app: {
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "client"),
  },
} as const;
