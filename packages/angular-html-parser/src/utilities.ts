import { getFakeSpan } from "../../compiler/test/expression_parser/utils/span.ts";
import { Lexer } from "../../compiler/src/expression_parser/lexer.ts";
import {
  Parser,
  SplitInterpolation,
} from "../../compiler/src/expression_parser/parser.ts";

function createParser(supportsDirectPipeReferences = false) {
  return new Parser(new Lexer(), supportsDirectPipeReferences);
}

function splitInterpolation(text: string): SplitInterpolation | null {
  return createParser().splitInterpolation(text, getFakeSpan(), [], null);
}

export { splitInterpolation };
