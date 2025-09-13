
import ora from "ora";
import path from "path";
import fs from "fs";
import { compileMCPX } from "../vendor/mcpx/compiler";

async function main() {
    const index = await compileMCPX("src/tools/**/*.mcpx.ts");
    fs.writeFileSync('mcp-index.json', JSON.stringify(index, null, 2))
}

main().then(
    () => console.log('Completed build')
)