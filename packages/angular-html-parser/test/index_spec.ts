import { parse, TagContentType } from "../src/index.js";
import { humanizeDom } from "../../compiler/test/ml_parser/ast_spec_utils.js";
import * as html from "../../compiler/src/ml_parser/ast.js";

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
        [html.Text, "text", 3, ["text"]],
        [html.Element, "template", 0],
        [html.Attribute, "lang", "something-else", ["something-else"]],
        [html.Text, "<div>", 1, ["<div>"]],
        [html.Element, "custom", 0],
        [html.Attribute, "lang", "babel", ["babel"]],
        [html.Text, 'const foo = "</";', 1, ['const foo = "</";']]
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

  it("should have `type` property when tokenizeBlocks is enabled", () => {
    const input = `@if (user.isHuman) { <p>Hello human</p> }`;
    const ast = parse(input, { tokenizeBlocks: true });
    expect(ast.rootNodes).toEqual([
      jasmine.objectContaining({
        name: "if",
        type: "block",
        parameters: [
          jasmine.objectContaining({ type: 'blockParameter', expression: 'user.isHuman' })
        ],
        children: [
          jasmine.objectContaining({ type: 'text', value: ' ' }),
          jasmine.objectContaining({
            type: 'element',
            name: 'p',
            children: [
              jasmine.objectContaining({ type: 'text', value: 'Hello human' })
            ]
          }),
          jasmine.objectContaining({ type: 'text', value: ' ' }),
        ]
      }),
    ]);
  });
});
