import { HtmlParser } from "../../compiler/src/ml_parser/html_parser";
import { TagContentType } from '../../compiler/src/ml_parser/tags';

let parser: HtmlParser | null = null;

const getParser = () => {
  if (!parser) {
    parser = new HtmlParser();
  }
  return parser;
};

export { TagContentType };

export interface ParseOptions {
  /**
   * any element can self close
   *
   * defaults to false
   */
  canSelfClose?: boolean,
  /**
   * support [`htm`](https://github.com/developit/htm) component closing tags (`<//>`)
   *
   * defaults to false
   */
  allowHtmComponentClosingTags?: boolean,
  /**
   * do not lowercase tag names before querying their tag definitions
   *
   * defaults to false
   */
  isTagNameCaseSensitive?: boolean,
  /**
   * customize tag content type
   *
   * defaults to the content type defined in the HTML spec
   */
  getTagContentType?: (tagName: string) => TagContentType,
}

export function parse(
  input: string,
  options: ParseOptions = {}
) {
  const {
    canSelfClose = false,
    allowHtmComponentClosingTags = false,
    isTagNameCaseSensitive = false,
    getTagContentType,
  } = options;
  return getParser().parse(
    input,
    "angular-html-parser",
    {
      tokenizeExpansionForms: false,
      interpolationConfig: undefined,
      canSelfClose,
      allowHtmComponentClosingTags,
    },
    isTagNameCaseSensitive,
    getTagContentType,
  );
}
