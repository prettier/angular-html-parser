import { describe, it, expect } from "vitest";
import { parse, TagContentType, TokenType } from "../src/index.ts";
import { humanizeDom } from "../../compiler/test/ml_parser/ast_spec_utils.ts";
import * as ast from "../../compiler/src/ml_parser/ast.ts";

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

it("Start tag comments", () => {
  expect(parse("<div/* comment */></div>").errors[0]).toMatchInlineSnapshot(
    `[Error: Opening tag "div" not terminated.]`,
  );
  expect(
    parse("<div/* block comment */></div>", { allowStartTagComments: true })
      .rootNodes,
  ).toEqual([
    expect.objectContaining({
      kind: "element",
      name: "div",
      comments: [
        expect.objectContaining({
          kind: "startTagComment",
          type: "multi",
          value: " block comment ",
        }),
      ],
    }),
  ]);
  expect(
    parse("<div// line comment\n></div>", { allowStartTagComments: true })
      .rootNodes,
  ).toEqual([
    expect.objectContaining({
      kind: "element",
      name: "div",
      comments: [
        expect.objectContaining({
          kind: "startTagComment",
          type: "single",
          value: " line comment",
        }),
      ],
    }),
  ]);
});

it("Edge cases", () => {
  expect(humanizeDom(parse("<html:style></html:style>"))).toEqual([
    [ast.Element, ":html:style", 0],
  ]);
});

describe("public token API", () => {
  it("should expose TokenType", () => {
    const node = parse('{{ "}}" }}').rootNodes[0] as ast.Text;
    expect(node).toBeInstanceOf(ast.Text);

    const token = node.tokens.find(
      ({ type }) => type === TokenType.INTERPOLATION,
    )!;
    expect(token.parts).toEqual(["{{", ' "}}" ', "}}"]);
  });
});

describe("escapable raw text interpolation", () => {
  describe.each(["textarea", "title"])("<%s>", (tagName) => {
    it.each([
      {
        name: "multiple expressions",
        content: "before {{value}} after {{other}}",
        value: "before {{value}} after {{other}}",
        expressions: ["value", "other"],
      },
      {
        name: "double braces inside a string",
        content: 'before {{ "{{first}} / {{second}}" }} after',
        value: 'before {{ "{{first}} / {{second}}" }} after',
        expressions: [' "{{first}} / {{second}}" '],
      },
      {
        name: "literal markup inside and outside an expression",
        content: '<b>{{ "<span>" }}</b>',
        value: '<b>{{ "<span>" }}</b>',
        expressions: [' "<span>" '],
      },
      {
        name: "entities inside and outside an expression",
        content: '&lt;{{ "&amp;" }}&#32;{{value}}&gt;',
        value: '<{{ "&" }} {{value}}>',
        expressions: [' "&amp;" ', "value"],
      },
      {
        name: "a leading LF",
        content: "\n{{value}}\n",
        value: "\n{{value}}\n",
        expressions: ["value"],
      },
      {
        name: "CRLF inside an expression",
        content: "{{a\r\n+b}}tail",
        value: "{{a\n+b}}tail",
        expressions: ["a\n+b"],
      },
      {
        name: "adjacent and empty expressions",
        content: "{{one}}{{two}}{{}}",
        value: "{{one}}{{two}}{{}}",
        expressions: ["one", "two", ""],
      },
    ])("should tokenize $name", ({ content, value, expressions }) => {
      const result = parse(`<${tagName}>${content}</${tagName}>`);
      expect(result.errors).toEqual([]);
      const element = result.rootNodes[0] as ast.Element;
      expect(element.children).toHaveLength(1);
      const text = element.children[0] as ast.Text;
      expect(text.value).toBe(
        tagName === "textarea" && value.startsWith("\n")
          ? value.slice(1)
          : value,
      );
      expect(
        text.tokens
          .filter((token) => token.type === TokenType.INTERPOLATION)
          .map((token) => token.parts),
      ).toEqual(expressions.map((expression) => ["{{", expression, "}}"]));
      expect(
        text.tokens.map((token) => token.sourceSpan.toString()).join(""),
      ).toBe(content);
    });
  });

  it("should stop an unfinished interpolation at the closing tag", () => {
    const result = parse("<textarea>{{value</textarea><div>after</div>");
    expect(result.errors).toEqual([]);
    const element = result.rootNodes[0] as ast.Element;
    const text = element.children[0] as ast.Text;
    expect(text.value).toBe("{{value");
    expect(
      text.tokens.find((token) => token.type === TokenType.INTERPOLATION)
        ?.parts,
    ).toEqual(["{{", "value"]);
    expect(element.endSourceSpan?.toString()).toBe("</textarea>");
    expect((result.rootNodes[1] as ast.Element).name).toBe("div");
  });

  it.each(["", "\\"])(
    "should keep the closing tag significant after %j in a quoted expression",
    (escape) => {
      const result = parse(
        `<textarea>{{ "${escape}</textarea>" }}<div>after</div>`,
      );
      expect(result.errors).toEqual([]);
      const element = result.rootNodes[0] as ast.Element;
      expect((element.children[0] as ast.Text).value).toBe(`{{ "${escape}`);
      expect(element.endSourceSpan?.toString()).toBe("</textarea>");
      expect((result.rootNodes[2] as ast.Element).name).toBe("div");
    },
  );

  describe.each(["textarea", "title"])(
    "invalid entities in <%s>",
    (tagName) => {
      it.each([
        { entity: "&bogus;", error: "Unknown entity" },
        { entity: "&#x110000;", error: "Unknown entity" },
        { entity: "&#x;", error: "Unknown entity" },
        { entity: "&#x41", error: "Unable to parse entity" },
        { entity: "\\&bogus;", error: "Unknown entity" },
      ])("should report $entity as a parse error", ({ entity, error }) => {
        const result = parse(`<${tagName}>{{ "${entity}" }}</${tagName}>`);
        expect(result.errors[0]?.msg).toContain(error);
      });
    },
  );

  it.each(["script", "style"])("should keep <%s> as raw text", (tagName) => {
    const content = '{{ "<b>&amp;" }}';
    const result = parse(`<${tagName}>${content}</${tagName}>`);
    expect(result.errors).toEqual([]);
    const element = result.rootNodes[0] as ast.Element;
    const text = element.children[0] as ast.Text;
    expect(text.value).toBe(content);
    expect(text.tokens.map((token) => token.type)).toEqual([
      TokenType.RAW_TEXT,
    ]);
  });
});
