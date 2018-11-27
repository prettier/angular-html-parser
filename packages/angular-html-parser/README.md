# angular-html-parser

[![npm](https://img.shields.io/npm/v/angular-html-parser.svg)](https://www.npmjs.com/package/angular-html-parser)
[![build](https://img.shields.io/travis/ikatyang/angular-html-parser/master.svg)](https://travis-ci.com/ikatyang/angular-html-parser/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/angular-html-parser/master.svg)](https://codecov.io/gh/ikatyang/angular-html-parser)

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
  /** defaults to false */
  canSelfClose?: boolean;
}
```

## Modifications

- add `CDATA` node
- add `DocType` node
- add `nameSpan` field to `Element` and `Attribute`
- add `canSelfClose` option
- allow case-insensitive closing tags for non-foreign elements
- fix `Comment#sourceSpan`
- support [bogus comments](https://www.w3.org/TR/html5/syntax.html#bogus-comment-state) (`<!...>`, `<?...>`)

## Development

```sh
# build
yarn run build

# test
yarn run test
```

## License

MIT © [Ika](https://github.com/ikatyang)
