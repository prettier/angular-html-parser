/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';

import {WINDOW} from '../../providers/index';
import {ClickOutside} from '../../directives/index';
import {Search} from '../../services/index';

import {TextField} from '../text-field/text-field.component';
import {FormsModule} from '@angular/forms';
import {ActiveDescendantKeyManager} from '@angular/cdk/a11y';
import {SearchItem} from '../../directives/search-item/search-item.directive';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router, RouterLink} from '@angular/router';
import {fromEvent} from 'rxjs';
import {AlgoliaIcon} from '../algolia-icon/algolia-icon.component';
import {RelativeLink} from '../../pipes/relative-link.pipe';

@Component({
  selector: 'docs-search-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ClickOutside,
    TextField,
    FormsModule,
    SearchItem,
    AlgoliaIcon,
    RelativeLink,
    RouterLink,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialog implements OnDestroy {
  onClose = output();
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('searchDialog');
  items = viewChildren(SearchItem);

  private readonly search = inject(Search);
  private readonly relativeLink = new RelativeLink();
  private readonly router = inject(Router);
  private readonly window = inject(WINDOW);
  private readonly injector = inject(Injector);
  private readonly keyManager = new ActiveDescendantKeyManager(
    this.items,
    this.injector,
  ).withWrap();

  searchQuery = this.search.searchQuery;
  searchResults = this.search.searchResults;

  constructor() {
    effect(() => {
      this.items();
      afterNextRender(
        {
          write: () => this.keyManager.setFirstItemActive(),
        },
        {injector: this.injector},
      );
    });

    this.keyManager.change.pipe(takeUntilDestroyed()).subscribe(() => {
      this.keyManager.activeItem?.scrollIntoView();
    });

    afterNextRender({
      write: () => {
        if (!this.dialog().nativeElement.open) {
          this.dialog().nativeElement.showModal?.();
        }
      },
    });

    fromEvent<KeyboardEvent>(this.window, 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        // When user presses Enter we can navigate to currently selected item in the search result list.
        if (event.key === 'Enter') {
          this.navigateToTheActiveItem();
        } else {
          this.keyManager.onKeydown(event);
        }
      });
  }

  ngOnDestroy(): void {
    this.keyManager.destroy();
  }

  closeSearchDialog() {
    this.dialog().nativeElement.close();
    this.onClose.emit();
  }

  private navigateToTheActiveItem(): void {
    const activeItemLink: string | undefined = this.keyManager.activeItem?.item?.url;

    if (!activeItemLink) {
      return;
    }

    this.router.navigateByUrl(this.relativeLink.transform(activeItemLink));
    this.onClose.emit();
  }
}
