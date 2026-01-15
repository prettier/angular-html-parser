import { parse, TagContentType } from "../src/index.js";
import { humanizeDom } from "../../compiler/test/ml_parser/ast_spec_utils.js";
import * as ast from "../../compiler/src/ml_parser/ast.js";
import { describe, it, expect } from "vitest";

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
        attrs: Array<{ prefix: string; name: string; value?: string }>,
      ) => {
        if (
          !hasParent &&
          (tagName !== "template" ||
            attrs.find((attr) => attr.name === "lang" && attr.value !== "html"))
        ) {
          return TagContentType.RAW_TEXT;
        }
      };
      expect(humanizeDom(parse(input, { getTagContentType }))).toEqual([
        [ast.Element, "template", 0],
        [ast.Element, "MyComponent", 1],
        [ast.Element, "template", 2],
        [ast.Attribute, "#content", ""],
        [ast.Text, "text", 3, ["text"]],
        [ast.Element, "template", 0],
        [ast.Attribute, "lang", "something-else", ["something-else"]],
        [ast.Text, "<div>", 1, ["<div>"]],
        [ast.Element, "custom", 0],
        [ast.Attribute, "lang", "babel", ["babel"]],
        [ast.Text, 'const foo = "</";', 1, ['const foo = "</";']],
      ]);
    });

    it("should be able to parse MJML", () => {
      const MJML_RAW_TAGS = new Set(["mj-style", "mj-raw"]);
      const result = parse("<mj-raw></p></mj-raw>", {
        getTagContentType: (tagName) =>
          MJML_RAW_TAGS.has(tagName) ? TagContentType.RAW_TEXT : undefined,
      });
      expect(humanizeDom(result)).toEqual([
        [ast.Element, "mj-raw", 0],
        [ast.Text, "</p>", 1, ["</p>"]],
      ]);
    });
  });
});

describe("AST format", () => {
  it("should have `type` property", () => {
    const input = `<!DOCTYPE html> <el attr></el>txt<!--  --><![CDATA[foo]]>`;
    const result = parse(input);
    expect(result.rootNodes).toEqual([
      expect.objectContaining({ kind: "docType" }),
      expect.objectContaining({ kind: "text" }),
      expect.objectContaining({
        kind: "element",
        attrs: [expect.objectContaining({ kind: "attribute" })],
      }),
      expect.objectContaining({ kind: "text" }),
      expect.objectContaining({ kind: "comment" }),
      expect.objectContaining({ kind: "cdata" }),
    ]);
  });

  it("should support 'tokenizeAngularBlocks'", () => {
    const input = `@if (user.isHuman) { <p>Hello human</p> }`;
    const result = parse(input, { tokenizeAngularBlocks: true });
    expect(result.rootNodes).toEqual([
      expect.objectContaining({
        name: "if",
        kind: "block",
        parameters: [
          expect.objectContaining({
            kind: "blockParameter",
            expression: "user.isHuman",
          }),
        ],
        children: [
          expect.objectContaining({ kind: "text", value: " " }),
          expect.objectContaining({
            kind: "element",
            name: "p",
            children: [
              expect.objectContaining({ kind: "text", value: "Hello human" }),
            ],
          }),
          expect.objectContaining({ kind: "text", value: " " }),
        ],
      }),
    ]);

    {
      const input = `
@switch (case) {
  @case (0)
  @case (1) {
    <div>case 0 or 1</div>
  }
  @case (2) {
    <div>case 2</div>
  }
  @default {
    <div>default</div>
  }
}
      `;
      const result = parse(input, { tokenizeAngularBlocks: true });
      expect(humanizeDom(result)).toEqual([
        [ast.Text, "\n", 0, ["\n"]],
        [ast.Block, "switch", 0],
        [ast.BlockParameter, "case"],
        [ast.Text, "\n  ", 1, ["\n  "]],
        [ast.Block, "case", 1],
        [ast.BlockParameter, "0"],
        [ast.Block, "case", 1],
        [ast.BlockParameter, "1"],
        [ast.Text, "\n    ", 2, ["\n    "]],
        [ast.Element, "div", 2],
        [ast.Text, "case 0 or 1", 3, ["case 0 or 1"]],
        [ast.Text, "\n  ", 2, ["\n  "]],
        [ast.Text, "\n  ", 1, ["\n  "]],
        [ast.Block, "case", 1],
        [ast.BlockParameter, "2"],
        [ast.Text, "\n    ", 2, ["\n    "]],
        [ast.Element, "div", 2],
        [ast.Text, "case 2", 3, ["case 2"]],
        [ast.Text, "\n  ", 2, ["\n  "]],
        [ast.Text, "\n  ", 1, ["\n  "]],
        [ast.Block, "default", 1],
        [ast.Text, "\n    ", 2, ["\n    "]],
        [ast.Element, "div", 2],
        [ast.Text, "default", 3, ["default"]],
        [ast.Text, "\n  ", 2, ["\n  "]],
        [ast.Text, "\n", 1, ["\n"]],
        [ast.Text, "\n      ", 0, ["\n      "]],
      ]);
    }
  });

  it("should support 'tokenizeAngularLetDeclaration'", () => {
    const input = `@let foo = 'bar';`;
    const result = parse(input, { tokenizeAngularLetDeclaration: true });
    expect(result.rootNodes).toEqual([
      expect.objectContaining({
        name: "foo",
        kind: "letDeclaration",
        value: "'bar'",
      }),
    ]);
  });

  // https://github.com/angular/angular/pull/60724
  it("should support 'enableAngularSelectorlessSyntax'", () => {
    {
      const result = parse("<div @Dir></div>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(result.rootNodes).toEqual([
        expect.objectContaining({
          name: "div",
          kind: "element",
          directives: [
            expect.objectContaining({
              name: "Dir",
              kind: "directive",
            }),
          ],
        }),
      ]);
    }

    {
      const result = parse("<MyComp>Hello</MyComp>", {
        enableAngularSelectorlessSyntax: true,
      });

      expect(result.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const result = parse("<MyComp/>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(result.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const result = parse("<MyComp:button>Hello</MyComp:button>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(result.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp:button",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const result = parse("<MyComp:svg:title>Hello</MyComp:svg:title>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(result.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp:svg:title",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }
  });
});

it("Edge cases", () => {
  expect(humanizeDom(parse("<html:style></html:style>"))).toEqual([
    [ast.Element, ":html:style", 0],
  ]);
});
