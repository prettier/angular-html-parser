import { it } from "vitest";
import { outdent } from "outdent";
import { parseXml } from "../src/index.ts";
import { humanizeDom } from "../../compiler/test/ml_parser/ast_spec_utils.js";
import * as ast from "../../compiler/src/ml_parser/ast.js";

it("parseXml", () => {
  const input = outdent`
<?xml version="1.0" encoding="UTF-8"?>
<message>
    <warning>
         Hello World
    </warning>
</message>
`;
  expect(humanizeDom(parseXml(input))).toEqual([
    [ast.Comment, '?xml version="1.0" encoding="UTF-8"?', 0],
    [ast.Text, "\n", 0, ["\n"]],
    [ast.Element, "message", 0],
    [ast.Text, "\n    ", 1, ["\n    "]],
    [ast.Element, "warning", 1],
    [
      ast.Text,
      "\n         Hello World\n    ",
      2,
      ["\n         Hello World\n    "],
    ],
    [ast.Text, "\n", 1, ["\n"]],
  ]);
});
