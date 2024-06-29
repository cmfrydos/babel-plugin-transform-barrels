const pluginTransform = require("../../pluginTransform");
const ospath = require("path");

describe('typescript transformation', () => {
  test("transformation of a named import", () => {
    expect(
      pluginTransform(
        'import {namedExport} from "./components";',
        __filename
      )
    ).toBe([
    `import { namedExport } from \"${ospath.resolve(__dirname)}\\components\\namedExport\\namedExport.ts";`,
    ].join("\n").replaceAll("\\","\\\\"));
  });
  
  test("transformation of a named import that was originally re-exported from a default export in the barrel file", () => {
    expect(
      pluginTransform(
        'import {defaultExport} from "./components";',
        __filename
      )
    ).toBe([
    `import defaultExport from \"${ospath.resolve(__dirname)}\\components\\defaultExport\\defaultExport.ts";`,
    ].join("\n").replaceAll("\\","\\\\"));
  });  
});
