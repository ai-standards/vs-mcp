// Common build orchestrator for project scripts
import { execSync } from "child_process";

function runStep(cmd: string, desc: string) {
  console.log(`\n--- ${desc} ---`);
  execSync(cmd, { stdio: "inherit" });
}

function main() {
  runStep("tsx scripts/build-mcp-types.ts", "Generating MCP types");
  // Add more build steps here as needed
  // runStep("ts-node scripts/build-docs.ts", "Building docs");
  // runStep("ts-node scripts/build-context.ts", "Building context files");
}

main();
