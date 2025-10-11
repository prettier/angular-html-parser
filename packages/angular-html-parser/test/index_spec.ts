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
        [html.Text, 'const foo = "</";', 1, ['const foo = "</";']],
      ]);
    });

    it("should be able to parse MJML", () => {
      const MJML_RAW_TAGS = new Set(["mj-style", "mj-raw"]);
      const result = parse('<mj-raw></p></mj-raw>', {
        getTagContentType: (tagName) =>
          MJML_RAW_TAGS.has(tagName) ? TagContentType.RAW_TEXT : undefined,
      });
      expect(humanizeDom(result)).toEqual([
        [html.Element, "mj-raw", 0],
        [html.Text, "</p>", 1, ["</p>"]],
      ]);
    });
  });
});

describe("AST format", () => {
  it("should have `type` property", () => {
    const input = `<!DOCTYPE html> <el attr></el>txt<!--  --><![CDATA[foo]]>`;
    const ast = parse(input);
    expect(ast.rootNodes).toEqual([
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
    const ast = parse(input, { tokenizeAngularBlocks: true });
    expect(ast.rootNodes).toEqual([
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
  });

  it("should support 'tokenizeAngularLetDeclaration'", () => {
    const input = `@let foo = 'bar';`;
    const ast = parse(input, { tokenizeAngularLetDeclaration: true });
    expect(ast.rootNodes).toEqual([
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
      const ast = parse("<div @Dir></div>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(ast.rootNodes).toEqual([
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
      const ast = parse("<MyComp>Hello</MyComp>", {
        enableAngularSelectorlessSyntax: true,
      });

      expect(ast.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const ast = parse("<MyComp/>", { enableAngularSelectorlessSyntax: true });
      expect(ast.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const ast = parse("<MyComp:button>Hello</MyComp:button>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(ast.rootNodes).toEqual([
        expect.objectContaining({
          fullName: "MyComp:button",
          componentName: "MyComp",
          kind: "component",
        }),
      ]);
    }

    {
      const ast = parse("<MyComp:svg:title>Hello</MyComp:svg:title>", {
        enableAngularSelectorlessSyntax: true,
      });
      expect(ast.rootNodes).toEqual([
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
    [html.Element, ":html:style", 0],
  ]);
});
