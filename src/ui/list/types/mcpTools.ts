// Auto-generated MCP tool types for strong typing

  | "ai.generateText"
  | "ai.generateData"
  | "ai.generateImages"
  | "ai.generateCode"
  | "ai.refactorCode"
  | "ai.testCode"
  | "ai.writeDocumentation"
  | "editor.openVirtual"
  | "editor.proposeEdits"
  | "fs.readFile"
  | "fs.writeFile"
  | "fs.readDir"
  | "fs.find"
  | "status.window"
  | "status.bar"
  | "status.dismiss"
  | "ui.info"
  | "ui.warn"
  | "ui.input";

  // ...existing AI tool payloads...
  "editor.openVirtual": {
    content: string;
    language?: string;
  };
  "editor.proposeEdits": {
    targetPath: string;
    newContent: string;
    title?: string;
  };
  "fs.readFile": {
    path: string;
  };
  "fs.writeFile": {
    path: string;
    content: string;
  };
  "fs.readDir": {
    dir: string;
  };
  "fs.find": {
    glob: string;
    maxResults?: number;
  };
  "status.window": {
    id: string;
    message: string;
  };
  "status.bar": {
    id: string;
    message: string;
    spinner?: boolean;
  };
  "status.dismiss": {
    id: string;
  };
  "ui.info": {
    message: string;
    actions?: string[];
  };
  "ui.warn": {
    message: string;
    actions?: string[];
  };
  "ui.input": {
    prompt: string;
    placeHolder?: string;
  };
  "ai.generateText": {
    prompt: string;
    maxTokens?: number;
    model?: string;
    temperature?: number;
  };
  "ai.generateData": {
    prompt: string;
    schema?: string;
    maxTokens?: number;
    model?: string;
    temperature?: number;
  };
  "ai.generateImages": {
    prompt: string;
    count?: number;
    size?: string;
    model?: string;
  };
  "ai.generateCode": {
    prompt: string;
    language?: string;
    style?: string;
    maxTokens?: number;
  };
  "ai.refactorCode": {
    code: string;
    instructions: string;
    language?: string;
    style?: string;
  };
  "ai.testCode": {
    code: string;
    framework?: string;
    language?: string;
  };
  "ai.writeDocumentation": {
    code: string;
    format?: string;
    audience?: string;
  };
}

  // ...existing AI tool responses...
  "editor.openVirtual": { ok: boolean };
  "editor.proposeEdits": { applied: boolean };
  "fs.readFile": { path: string; text: string };
  "fs.writeFile": { ok: boolean; path: string };
  "fs.readDir": { dir: string; items: { name: string; type: string }[] };
  "fs.find": { files: string[] };
  "status.window": { shown: boolean };
  "status.bar": { shown: boolean; spinner: boolean };
  "status.dismiss": { dismissed: boolean };
  "ui.info": { choice: string | null };
  "ui.warn": { choice: string | null };
  "ui.input": { value: string | null };
  "ai.generateText": { text: string };
  "ai.generateData": { data: any };
  "ai.generateImages": { images: any[]; note?: string };
  "ai.generateCode": { code: string; language: string };
  "ai.refactorCode": { code: string };
  "ai.testCode": { tests: string; framework: string; language: string };
  "ai.writeDocumentation": { docs: string; format: string };
}
