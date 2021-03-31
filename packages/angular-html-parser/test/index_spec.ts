import { parse, TagContentType } from "../src/index";
import { humanizeDom } from "../../compiler/test/ml_parser/ast_spec_utils";
import * as html from "../../compiler/src/ml_parser/ast";

describe("options", () => {
  describe("getTagContentType", () => {
    it("should be able to parse Vue SFC", () => {
      const input = `
<template>
  <MyComponent>
    <template #content>
      text
    </template>
  </MyComponent>
</template>
<template lang="something-else">
  <div>
</template>
<custom lang="babel">
  const foo = "</";
</custom>
`.replace(/\n */g, "");
      const getTagContentType = (
        tagName: string,
        prefix: string,
        hasParent: boolean,
        attrs: Array<{ prefix: string; name: string; value?: string }>
      ) => {
        if (
          !hasParent &&
          (tagName !== "template" ||
            attrs.find(attr => attr.name === "lang" && attr.value !== "html"))
        ) {
          return TagContentType.RAW_TEXT;
        }
      };
      expect(humanizeDom(parse(input, { getTagContentType }))).toEqual([
        [html.Element, "template", 0],
        [html.Element, "MyComponent", 1],
        [html.Element, "template", 2],
        [html.Attribute, "#content", ""],
        [html.Text, "text", 3],
        [html.Element, "template", 0],
        [html.Attribute, "lang", "something-else"],
        [html.Text, "<div>", 1],
        [html.Element, "custom", 0],
        [html.Attribute, "lang", "babel"],
        [html.Text, 'const foo = "</";', 1]
      ]);
    });
  });
});

describe("AST format", () => {
  it("should have `type` property", () => {
    const input = `<!DOCTYPE html> <el attr></el>txt<!--  --><![CDATA[foo]]>`;
    const ast = parse(input);
    expect(ast.rootNodes).toEqual([
      jasmine.objectContaining({ type: "docType" }),
      jasmine.objectContaining({ type: "text" }),
      jasmine.objectContaining({
        type: "element",
        attrs: [jasmine.objectContaining({ type: "attribute" })],
      }),
      jasmine.objectContaining({ type: "text" }),
      jasmine.objectContaining({ type: "comment" }),
      jasmine.objectContaining({ type: "cdata" }),
    ]);
  });
});
