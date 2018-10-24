import { HtmlParser } from "../../compiler/src/ml_parser/html_parser";

let parser: HtmlParser | null = null;

const getParser = () => {
  if (!parser) {
    parser = new HtmlParser();
  }
  return parser;
};

export function parse(input: string, { canSelfClose = false } = {}) {
  return getParser().parse(
    input,
    "angular-html-parser",
    false,
    undefined,
    canSelfClose
  );
}
