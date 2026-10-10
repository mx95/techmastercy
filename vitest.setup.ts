import { beforeAll } from "vitest";
import { execSync } from "child_process";
import path from "path";

const testDbPath = path.resolve(__dirname, "prisma/test.db");
process.env.DATABASE_URL = `file:${testDbPath}`;
if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, "NODE_ENV", { value: "test", writable: true });
}
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || "test-session-secret-at-least-32-characters-long";
process.env.PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || "mock";
process.env.ALLOW_MOCK_PAYMENTS = process.env.ALLOW_MOCK_PAYMENTS || "true";
process.env.TAX_RATE_BPS = process.env.TAX_RATE_BPS || "1900";
process.env.TAX_INCLUSIVE = process.env.TAX_INCLUSIVE || "true";

beforeAll(() => {
  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
  });
});
