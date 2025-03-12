/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {getHtmlTagDefinition} from './html_tags';
import {TokenizeOptions} from './lexer';
import {Parser, ParseTreeResult} from './parser';
import {TagContentType} from './tags';

export class HtmlParser extends Parser {
  constructor() {
    super(getHtmlTagDefinition);
  }

  // angular-html-parser: More options
  override parse(
    source: string,
    url: string,
    options?: TokenizeOptions,
    isTagNameCaseSensitive = false,
    getTagContentType?: (tagName: string, prefix: string, hasParent: boolean, attrs: Array<{prefix: string, name: string, value?: string}>) => void | TagContentType
  ): ParseTreeResult {
    return super.parse(
      source,
      url,
      options,
      isTagNameCaseSensitive,
      getTagContentType,
    );
  }

  // override parse(source: string, url: string, options?: TokenizeOptions): ParseTreeResult {
  //   return super.parse(source, url, options);
  // }
}
