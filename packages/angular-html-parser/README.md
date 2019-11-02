# angular-html-parser

[![npm](https://img.shields.io/npm/v/angular-html-parser.svg)](https://www.npmjs.com/package/angular-html-parser)
[![build](https://img.shields.io/travis/com/ikatyang/angular-html-parser/master.svg)](https://travis-ci.com/ikatyang/angular-html-parser/builds)

A HTML parser extracted from Angular with some [modifications](#modifications)

[Changelog](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/CHANGELOG.md)

## Install

```sh
# using npm
npm install --save angular-html-parser

# using yarn
yarn add angular-html-parser
```

## Usage

```js
const ngHtmlParser = require('angular-html-parser');

const { rootNodes, errors } = ngHtmlParser.parse('<div>hello world</div>');
```

## API

```ts
declare function parse(input: string, options?: Options): ng.ParseTreeResult;

interface Options {
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
}
```

## Modifications

- add `CDATA` node
- add `DocType` node
- add `nameSpan` field to `Element` and `Attribute`
- allow case-insensitive closing tags for non-foreign elements
- fix `Comment#sourceSpan`
- support [bogus comments](https://www.w3.org/TR/html5/syntax.html#bogus-comment-state) (`<!...>`, `<?...>`)
- support full [named entities](https://html.spec.whatwg.org/multipage/entities.json)

## Development

```sh
# build
yarn run build

# test
yarn run test
```

## License

MIT © [Ika](https://github.com/ikatyang)
