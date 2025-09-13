// mcpx-compiler.ts
import { Project, SourceFile, Type, TypeChecker, Node, FunctionDeclaration, VariableDeclaration, Symbol as MorphSymbol } from "ts-morph";
import fg from "fast-glob";
import * as path from "path";
import { de } from "zod/v4/locales";

type TypeAtom = { type: string; required: boolean };
type TypeMap = Record<string, TypeAtom>;

export type McpxTool = {
  id: string;             // function name (or "default" if anonymous default export)
  name: string;           // id or JSDoc, if present
  path: string;           // absolute file path
  description?: string;   // from JSDoc, if present
  input: TypeMap;         // first-parameter object properties -> type(s)
  output: TypeMap;        // resolved return object (Promise unwrapped) -> type(s)
};

export type CompileOptions = {
  /** Optional cwd for globbing. Defaults to process.cwd(). */
  cwd?: string;
  /** Optional tsconfig path. If omitted, a loose project is created. */
  tsconfig?: string;
  /**
   * If set, only extract this function name (per file). Otherwise:
   *  - default-exported function (if any), and
   *  - any named exported functions
   */
  functionName?: string;
};

/* ----------------------- internal extractor (private) ---------------------- */

function typeToAtom(t: Type, checker: TypeChecker): TypeAtom {
  if (t.isUnion()) {
    const parts = t.getUnionTypes().map(u => checker.getTypeText(u));
    const isOptional = parts.includes('undefined');
    const mainType = parts.find(p => p !== 'undefined');
    return {
      type: mainType || 'unknown',
      required: !isOptional
    };
  }
  return {
    type: checker.getTypeText(t),
    required: true
  };
}

function objectTypeToMap(objType: Type, checker: TypeChecker): TypeMap {
  const out: TypeMap = {};
  for (const prop of objType.getProperties()) {
    const decl = prop.getDeclarations()[0];
    if (!decl) continue;
    const pType = checker.getTypeOfSymbolAtLocation(prop, decl);
    out[prop.getName()] = typeToAtom(pType, checker);
  }
  return out;
}

function unwrapPromiseIfNeeded(t: Type): Type {
  // Promise<T> detection via symbol name and typeArgs
  const sym = t.getSymbol();
  if (sym?.getName() === "Promise") {
    const args = t.getTypeArguments?.() ?? [];
    if (args.length) return args[0];
  }
  return t;
}

function getFunctionDocs(sym?: MorphSymbol): {name?: string, description?: string} | undefined {
  if (!sym) return;
  const docs = sym.getJsDocTags?.() ?? [];
  if (! docs) {
    return undefined;
  }

  const description = docs.find(d => d.getName() === 'description');
  const name = docs.find(d => d.getName() === 'name');

  return {
    name: name?.getText()[0].text,
    description: description?.getText()[0].text
  }
}

function getFunctionLikeNodes(sf: SourceFile, opts?: { functionName?: string }) {
  const results: Array<{ node: FunctionDeclaration | VariableDeclaration; name: string; isDefault: boolean }> = [];

  // Named exported function declarations
  sf.getFunctions().forEach(fn => {
    const name = fn.getName() ?? "default";
    const isExported = fn.isExported() || fn.isDefaultExport();
    if (!isExported) return;
    if (opts?.functionName && name !== opts.functionName) return;
    results.push({ node: fn, name, isDefault: fn.isDefaultExport() });
  });

  // Exported const foo = (..) => { }  OR function expressions assigned to vars
  sf.getVariableDeclarations().forEach(v => {
    const init = v.getInitializer();
    if (!init) return;

    const isFunc =
      Node.isFunctionExpression(init) ||
      Node.isArrowFunction(init);

    if (!isFunc) return;

    const vd = v.getVariableStatement();
    const isExported =
      vd?.isExported() || vd?.isDefaultExport() || v.isDefaultExport();

    if (!isExported) return;

    const name = v.getName() || "default";
    if (opts?.functionName && name !== opts.functionName) return;

    results.push({ node: v, name, isDefault: !!(vd?.isDefaultExport() || v.isDefaultExport()) });
  });

  // If a specific functionName was requested and not found, results may be empty.
  return results;
}

function getSignatureFromNode(
  node: FunctionDeclaration | VariableDeclaration,
  checker: TypeChecker
) {
  if (Node.isFunctionDeclaration(node)) {
    return checker.getSignatureFromNode(node) ?? null;
  }
  // VariableDeclaration with function initializer
  const init = node.getInitializer();
  if (init && (Node.isFunctionExpression(init) || Node.isArrowFunction(init))) {
    return checker.getSignatureFromNode(init) ?? null;
  }
  return null;
}

function extractIOFromFunctionNode(
  filePath: string,
  node: FunctionDeclaration | VariableDeclaration,
  nameHint: string,
  checker: TypeChecker
): McpxTool | null {
  const sig = getSignatureFromNode(node, checker);
  if (!sig) return null;

  // INPUT: first parameter’s object type (if any)
  let input: TypeMap = {};
  const params = sig.getParameters();
  if (params.length > 0) {
    const decl = params[0].getDeclarations()[0];
    if (decl) {
      const inputType = checker.getTypeAtLocation(decl);
      // Only convert object-like types to map. If scalar, expose as __self
      if (inputType.getProperties().length > 0) {
        input = objectTypeToMap(inputType, checker);
      } else {
        input = { __self: typeToAtom(inputType, checker) };
      }
    }
  }

  // OUTPUT: unwrap Promise<T> then object map (or __self if scalar)
  let retType = checker.getReturnTypeOfSignature(sig);
  retType = unwrapPromiseIfNeeded(retType);
  let output: TypeMap = {};
  if (retType.getProperties().length > 0) {
    output = objectTypeToMap(retType, checker);
  } else {
    output = { __self: typeToAtom(retType, checker) };
  }

  // Name
  let id = nameHint || "default";
  if (Node.isFunctionDeclaration(node)) {
    id = node.getName() ?? nameHint ?? "default";
  }

  // JSDoc description
  const sym = node.getSymbol() ?? (Node.isFunctionDeclaration(node)
    ? node.getNameNode()?.getSymbol()
    : node.getNameNode()?.getSymbol());
  const {description, name} = getFunctionDocs(sym);

  // Make path relative to cwd
  const cwd = process.cwd();
  const relPath = path.relative(cwd, filePath);
  return {
    id,
    name: name || id,
    path: relPath,
    description,
    input,
    output,
  };
}

/* ------------------------------ public api ------------------------------- */

export async function compileMCPX(
  patterns: string | string[],
  options: CompileOptions = {}
): Promise<{ tools: McpxTool[] }> {
  const cwd = options.cwd ?? process.cwd();
  const files = await fg(patterns, {
    cwd,
    absolute: true,
    onlyFiles: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
    extglob: true,
  });

  // ts-morph project
  const project = options.tsconfig
    ? new Project({ tsConfigFilePath: path.resolve(cwd, options.tsconfig) })
    : new Project({
        compilerOptions: {
          target: 99, // ESNext
          module: 99, // ESNext
          strict: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowJs: true,
          checkJs: false,
          moduleResolution: 99,
          resolveJsonModule: true,
        },
      });

  // Add files to project (only once)
  const sourceFiles = files.map(fp => project.addSourceFileAtPathIfExists(fp) ?? project.addSourceFileAtPath(fp));

  const checker = project.getTypeChecker();
  const tools: McpxTool[] = [];

  for (const sf of sourceFiles) {
    const fns = getFunctionLikeNodes(sf, { functionName: options.functionName });
    if (!fns || fns.length === 0) continue;

    for (const { node, name } of fns) {
      const tool = extractIOFromFunctionNode(sf.getFilePath(), node, name, checker);
      if (tool) tools.push(tool);
    }
  }

  return { tools };
}
