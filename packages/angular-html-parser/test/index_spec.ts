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
<custom lang="babel">
  const foo = "</";
</custom>
`.replace(/\n */g, "");
      const getTagContentType = (
        tagName: string,
        prefix: string,
        hasParent: boolean
      ) => {
        if (!hasParent && tagName !== "template") {
          return TagContentType.RAW_TEXT;
        }
      };
      expect(humanizeDom(parse(input, { getTagContentType }))).toEqual([
        [html.Element, "template", 0],
        [html.Element, "MyComponent", 1],
        [html.Element, "template", 2],
        [html.Attribute, "#content", ""],
        [html.Text, "text", 3],
        [html.Element, "custom", 0],
        [html.Attribute, "lang", "babel"],
        [html.Text, 'const foo = "</";', 1]
      ]);
    });
  });
});
