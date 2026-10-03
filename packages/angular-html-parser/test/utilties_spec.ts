import { it, expect } from "vitest";
import { splitInterpolation } from "../src/index.ts";

it("splitInterpolation", () => {
  expect(splitInterpolation('before {{  "}}"  }}')).toMatchInlineSnapshot(`
    SplitInterpolation {
      "expressions": [
        {
          "end": 19,
          "start": 7,
          "text": "  "}}"  ",
        },
      ],
      "offsets": [
        9,
      ],
      "strings": [
        {
          "end": 7,
          "start": 0,
          "text": "before ",
        },
        {
          "end": 19,
          "start": 19,
          "text": "",
        },
      ],
    }
  `);
});
