import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = "https://efficient-antelope-673.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

async function main() {
  console.log("Starting migration...");
  console.log("This will download images from Supabase and upload to Convex.");
  console.log("This may take a few minutes.\n");

  try {
    const result = await client.action(api.migrate.migrateAll);
    console.log(result);
  } catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
  }
}

main();
