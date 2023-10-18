/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT, isPlatformServer} from '@angular/common';
import {APP_ID, CSP_NONCE, Inject, Injectable, OnDestroy, Optional, PLATFORM_ID} from '@angular/core';

/** The style elements attribute name used to set value of `APP_ID` token. */
const APP_ID_ATTRIBUTE_NAME = 'ng-app-id';

@Injectable()
export class SharedStylesHost implements OnDestroy {
  // Maps all registered host nodes to a list of style nodes that have been added to the host node.
  private readonly styleRef = new Map < string /** Style string */, {
    elements: Map</** Host */ Node, /** Style Node */ HTMLStyleElement>;
    usage: number;
  }
  > ();
  private readonly hostNodes = new Set<Node>();
  private readonly styleNodesInDOM: Map<string, HTMLStyleElement>|null;
  private readonly platformIsServer: boolean;

  constructor(
      @Inject(DOCUMENT) private readonly doc: Document,
      @Inject(APP_ID) private readonly appId: string,
      @Inject(CSP_NONCE) @Optional() private nonce?: string|null,
      @Inject(PLATFORM_ID) readonly platformId: object = {},
  ) {
    this.styleNodesInDOM = this.collectServerRenderedStyles();
    this.platformIsServer = isPlatformServer(platformId);
    this.resetHostNodes();
  }

  addStyles(styles: string[]): void {
    for (const style of styles) {
      const usageCount = this.changeUsageCount(style, 1);

      if (usageCount === 1) {
        this.onStyleAdded(style);
      }
    }
  }

  disableStyles(styles: string[]): void {
    for (const style of styles) {
      const usageCount = this.changeUsageCount(style, -1);

      if (usageCount === 0) {
        this.visitStyleElement(style, disableStylesheet);
      }
    }
  }

  visitStyleElement(style: string, callback: (node: HTMLStyleElement) => void): void {
    this.styleRef.get(style)?.elements?.forEach(callback);
  }

  ngOnDestroy(): void {
    const styleNodesInDOM = this.styleNodesInDOM;
    if (styleNodesInDOM) {
      styleNodesInDOM.forEach((node) => node.remove());
      styleNodesInDOM.clear();
    }

    for (const style of this.getAllStyles()) {
      this.visitStyleElement(style, (node) => node.remove());
      this.styleRef.delete(style);
    }

    this.resetHostNodes();
  }

  addHost(hostNode: Node): void {
    this.hostNodes.add(hostNode);

    for (const style of this.getAllStyles()) {
      this.addStyleToHost(hostNode, style);
    }
  }

  removeHost(hostNode: Node): void {
    this.hostNodes.delete(hostNode);
    for (const {elements} of this.styleRef.values()) {
      elements.delete(hostNode);
    }
  }

  private getAllStyles(): IterableIterator<string> {
    return this.styleRef.keys();
  }

  private onStyleAdded(style: string): void {
    for (const host of this.hostNodes) {
      this.addStyleToHost(host, style);
    }
  }

  private collectServerRenderedStyles(): Map<string, HTMLStyleElement>|null {
    const styles = this.doc.head?.querySelectorAll<HTMLStyleElement>(
        `style[${APP_ID_ATTRIBUTE_NAME}="${this.appId}"]`);

    if (styles?.length) {
      const styleMap = new Map<string, HTMLStyleElement>();

      styles.forEach((style) => {
        if (style.textContent != null) {
          styleMap.set(style.textContent, style);
        }
      });

      return styleMap;
    }

    return null;
  }

  private changeUsageCount(style: string, delta: number): number {
    const map = this.styleRef;
    if (map.has(style)) {
      const styleRefValue = map.get(style)!;
      styleRefValue.usage = nonNegativeNumber(styleRefValue.usage + delta);

      return styleRefValue.usage;
    }

    const usage = nonNegativeNumber(delta);
    map.set(style, {usage, elements: new Map()});
    return usage;
  }

  private getStyleElement(
      host: Node, style: string,
      existingStyleElements: Map<Node, HTMLStyleElement>|undefined): HTMLStyleElement {
    const existingStyleElement = existingStyleElements?.get(host);
    if (existingStyleElement) {
      return existingStyleElement;
    }

    const styleNodesInDOM = this.styleNodesInDOM;
    const styleEl = styleNodesInDOM?.get(style);
    if (styleEl?.parentNode === host) {
      // `styleNodesInDOM` cannot be undefined due to the above `styleNodesInDOM?.get`.
      styleNodesInDOM!.delete(style);

      styleEl.removeAttribute(APP_ID_ATTRIBUTE_NAME);

      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        // This attribute is solely used for debugging purposes.
        styleEl.setAttribute('ng-style-reused', '');
      }

      return styleEl;
    } else {
      const styleEl = this.doc.createElement('style');

      if (this.nonce) {
        styleEl.setAttribute('nonce', this.nonce);
      }

      styleEl.textContent = style;

      if (this.platformIsServer) {
        styleEl.setAttribute(APP_ID_ATTRIBUTE_NAME, this.appId);
      }

      host.appendChild(styleEl);

      return styleEl;
    }
  }

  private addStyleToHost(host: Node, style: string): void {
    const styleRef = this.styleRef;
    const styleResult = styleRef.get(style)!;  // This will always be defined in `changeUsageCount`
    const styleEl = this.getStyleElement(host, style, styleResult.elements);

    if (styleResult.usage === 0) {
      disableStylesheet(styleEl);
    } else {
      enableStylesheet(styleEl);
    }

    styleResult.elements.set(host, styleEl);
  }

  private resetHostNodes(): void {
    const hostNodes = this.hostNodes;
    hostNodes.clear();
    // Re-add the head element back since this is the default host.
    hostNodes.add(this.doc.head);
  }
}

/**
 * When a component that has styles is destroyed, we disable stylesheets
 * instead of removing them to avoid performance issues related to style
 * recalculation in a browser.
 */
function disableStylesheet(node: HTMLStyleElement): void {
  node.disabled = true;
}

/**
 * Enables a stylesheet in a browser, see the `disableStylesheet` function
 * docs for additional info.
 */
function enableStylesheet(node: HTMLStyleElement): void {
  node.disabled = false;
}

/**
 * When the value is a negative a value of `0` is returned.
 */
function nonNegativeNumber(value: number): number {
  return value < 0 ? 0 : value;
}
