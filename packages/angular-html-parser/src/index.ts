import { HtmlParser } from "../../compiler/src/ml_parser/html_parser.js";
import { XmlParser } from "../../compiler/src/ml_parser/xml_parser.js";
import type { TagContentType } from "../../compiler/src/ml_parser/tags.js";
import { ParseTreeResult as HtmlParseTreeResult } from "../../compiler/src/ml_parser/parser.js";

export interface HtmlParseOptions {
  /**
   * any element can self close
   *
   * defaults to false
   */
  canSelfClose?: boolean;
  /**
   * support [`htm`](https://github.com/developit/htm) component closing tags (`<//>`)
   *
   * defaults to false
   */
  allowHtmComponentClosingTags?: boolean;
  /**
   * do not lowercase tag names before querying their tag definitions
   *
   * defaults to false
   */
  isTagNameCaseSensitive?: boolean;
  /**
   * customize tag content type
   *
   * defaults to the content type defined in the HTML spec
   */
  getTagContentType?: (
    tagName: string,
    prefix: string,
    hasParent: boolean,
    attrs: Array<{ prefix: string; name: string; value?: string }>,
  ) => void | TagContentType;
  /**
   * tokenize angular control flow block syntax
   */
  tokenizeAngularBlocks?: boolean;
  /**
   * tokenize angular let declaration syntax
   */
  tokenizeAngularLetDeclaration?: boolean;

  /**
   * enable angular selectorless syntax
   */
  enableAngularSelectorlessSyntax?: boolean;
}

let htmlParser: HtmlParser;
export function parseHtml(
  input: string,
  options: HtmlParseOptions = {},
): HtmlParseTreeResult {
  const {
    canSelfClose = false,
    allowHtmComponentClosingTags = false,
    isTagNameCaseSensitive = false,
    getTagContentType,
    tokenizeAngularBlocks = false,
    tokenizeAngularLetDeclaration = false,
    enableAngularSelectorlessSyntax = false,
  } = options;
  htmlParser ??= new HtmlParser();

  return htmlParser.parse(
    input,
    "angular-html-parser",
    {
      tokenizeExpansionForms: tokenizeAngularBlocks,
      canSelfClose,
      allowHtmComponentClosingTags,
      tokenizeBlocks: tokenizeAngularBlocks,
      tokenizeLet: tokenizeAngularLetDeclaration,
      selectorlessEnabled: enableAngularSelectorlessSyntax,
    },
    isTagNameCaseSensitive,
    getTagContentType,
  );
}

let xmlParser: XmlParser;
export function parseXml(input: string) {
  xmlParser ??= new XmlParser();

  return xmlParser.parse(input, "angular-xml-parser");
}

// For prettier
export { TagContentType } from "../../compiler/src/ml_parser/tags.js";
export {
  RecursiveVisitor,
  visitAll,
} from "../../compiler/src/ml_parser/ast.js";
export {
  ParseSourceSpan,
  ParseLocation,
  ParseSourceFile,
} from "../../compiler/src/parse_util.js";
export { getHtmlTagDefinition } from "../../compiler/src/ml_parser/html_tags.js";

// Types
export type { ParseTreeResult } from "../../compiler/src/ml_parser/parser.js";
export type * as Ast from "../../compiler/src/ml_parser/ast.js";

// Remove these alias in next major release
export type { HtmlParseOptions as ParseOptions };
export { parseHtml as parse };
