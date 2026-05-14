const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`${name} environment variable is not defined`);
  }
  return value;
};

const requireNumberEnv = (name: string, value: string | undefined): number => {
  const parsed = Number(requireEnv(name, value));
  if (Number.isNaN(parsed)) {
    throw new Error(`${name} environment variable must be a valid number`);
  }
  return parsed;
};

const publicEnv = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  NEXT_PUBLIC_EXTERNAL_URL: requireEnv(
    "NEXT_PUBLIC_EXTERNAL_URL",
    process.env.NEXT_PUBLIC_EXTERNAL_URL,
  ),
  NEXT_PUBLIC_BASIC_URL: requireEnv(
    "NEXT_PUBLIC_BASIC_URL",
    process.env.NEXT_PUBLIC_BASIC_URL,
  ),
};

const getServerEnv = () => ({
  MONGODB_URI: requireEnv("MONGODB_URI", process.env.MONGODB_URI),
  JWT_SECRET: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  EMAIL_SERVER_HOST: requireEnv(
    "EMAIL_SERVER_HOST",
    process.env.EMAIL_SERVER_HOST,
  ),
  EMAIL_SERVER_PORT: requireNumberEnv(
    "EMAIL_SERVER_PORT",
    process.env.EMAIL_SERVER_PORT,
  ),
  EMAIL_SERVER_USER: requireEnv(
    "EMAIL_SERVER_USER",
    process.env.EMAIL_SERVER_USER,
  ),
  EMAIL_SERVER_PASSWORD: requireEnv(
    "EMAIL_SERVER_PASSWORD",
    process.env.EMAIL_SERVER_PASSWORD,
  ),
});

export { getServerEnv, publicEnv };
