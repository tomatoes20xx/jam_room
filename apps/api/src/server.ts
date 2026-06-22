import { buildApp } from "./app.js";
import { env } from "./env.js";

async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(`Jam Room API listening on :${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
