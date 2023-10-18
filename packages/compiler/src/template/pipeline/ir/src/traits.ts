/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import type {ParseSourceSpan} from '../../../../parse_util';
import type {Expression} from './expression';
import type {Op, XrefId} from './operations';

/**
 * Marker symbol for `ConsumesSlotOpTrait`.
 */
export const ConsumesSlot = Symbol('ConsumesSlot');

/**
 * Marker symbol for `DependsOnSlotContextOpTrait`.
 */
export const DependsOnSlotContext = Symbol('DependsOnSlotContext');

/**
 * Marker symbol for `UsesSlotIndex` trait.
 */
export const UsesSlotIndex = Symbol('UsesSlotIndex');

/**
 * Marker symbol for `ConsumesVars` trait.
 */
export const ConsumesVarsTrait = Symbol('ConsumesVars');

/**
 * Marker symbol for `UsesVarOffset` trait.
 */
export const UsesVarOffset = Symbol('UsesVarOffset');

/**
 * Marker symbol for `HasConst` trait.
 */
export const HasConst = Symbol('HasConst');

/**
 * Marks an operation as requiring allocation of one or more data slots for storage.
 */
export interface ConsumesSlotOpTrait {
  readonly[ConsumesSlot]: true;

  /**
   * Assigned data slot (the starting index, if more than one slot is needed) for this operation, or
   * `null` if slots have not yet been assigned.
   */
  slot: number|null;

  /**
   * The number of slots which will be used by this operation. By default 1, but can be increased if
   * necessary.
   */
  numSlotsUsed: number;

  /**
   * `XrefId` of this operation (e.g. the element stored in the assigned slot). This `XrefId` is
   * used to link this `ConsumesSlotOpTrait` operation with `DependsOnSlotContextTrait` or
   * `UsesSlotIndexExprTrait` implementors and ensure that the assigned slot is propagated through
   * the IR to all consumers.
   */
  xref: XrefId;
}


/**
 * Marks an operation as depending on the runtime's implicit slot context being set to a particular
 * slot.
 *
 * The runtime has an implicit slot context which is adjusted using the `advance()` instruction
 * during the execution of template update functions. This trait marks an operation as requiring
 * this implicit context to be `advance()`'d to point at a particular slot prior to execution.
 */
export interface DependsOnSlotContextOpTrait {
  readonly[DependsOnSlotContext]: true;

  /**
   * `XrefId` of the `ConsumesSlotOpTrait` which the implicit slot context must reference before
   * this operation can be executed.
   */
  target: XrefId;

  sourceSpan: ParseSourceSpan;
}


/**
 * Marks an expression which requires knowledge of the assigned slot of a given
 * `ConsumesSlotOpTrait` implementor (e.g. an element slot).
 *
 * During IR processing, assigned slots of `ConsumesSlotOpTrait` implementors will be propagated to
 * `UsesSlotIndexTrait` implementors by matching their `XrefId`s.
 */
export interface UsesSlotIndexTrait {
  readonly[UsesSlotIndex]: true;

  /**
   * `XrefId` of the `ConsumesSlotOpTrait` which this expression needs to reference by its assigned
   * slot index.
   */
  target: XrefId;

  /**
   * The slot index of `target`, or `null` if slots have not yet been assigned.
   */
  targetSlot: number|null;
}

/**
 * Marker trait indicating that an operation or expression consumes variable storage space.
 */
export interface ConsumesVarsTrait {
  [ConsumesVarsTrait]: true;
}

/**
 * Marker trait indicating that an expression requires knowledge of the number of variable storage
 * slots used prior to it.
 */
export interface UsesVarOffsetTrait {
  [UsesVarOffset]: true;

  varOffset: number|null;
}

/**
 * Marker trait indicating that an op or expression has some data which should be collected into the
 * component constant array.
 *
 */
export interface HasConstTrait {
  [HasConst]: true;

  /**
   * The constant to be collected into the const array, if non-null.
   */
  constValue: unknown|null;

  /**
   * The index of the collected constant, after processing.
   */
  constIndex: number|null;

  /**
   * A callback which converts the constValue into an o.Expression for the const array.
   */
  makeExpression: (value: unknown) => o.Expression;
}

/**
 * Default values for most `ConsumesSlotOpTrait` fields (used with the spread operator to initialize
 * implementors of the trait).
 */
export const TRAIT_CONSUMES_SLOT: Omit<ConsumesSlotOpTrait, 'xref'> = {
  [ConsumesSlot]: true,
  slot: null,
  numSlotsUsed: 1,
} as const;

/**
 * Default values for most `UsesSlotIndexTrait` fields (used with the spread operator to initialize
 * implementors of the trait).
 */
export const TRAIT_USES_SLOT_INDEX: Omit<UsesSlotIndexTrait, 'target'> = {
  [UsesSlotIndex]: true,
  targetSlot: null,
} as const;

/**
 * Default values for most `DependsOnSlotContextOpTrait` fields (used with the spread operator to
 * initialize implementors of the trait).
 */
export const TRAIT_DEPENDS_ON_SLOT_CONTEXT:
    Omit<DependsOnSlotContextOpTrait, 'target'|'sourceSpan'> = {
      [DependsOnSlotContext]: true,
    } as const;

/**
 * Default values for `UsesVars` fields (used with the spread operator to initialize
 * implementors of the trait).
 */
export const TRAIT_CONSUMES_VARS: ConsumesVarsTrait = {
  [ConsumesVarsTrait]: true,
} as const;

/**
 * Default values for `UsesVarOffset` fields (used with the spread operator to initialize
 * implementors of this trait).
 */
export const TRAIT_USES_VAR_OFFSET: UsesVarOffsetTrait = {
  [UsesVarOffset]: true,
  varOffset: null,
} as const;

/**
 * Default values for `HasConst` fields (used with the spread operator to initialize
 * implementors of this trait).
 */
export const TRAIT_HAS_CONST: Omit<HasConstTrait, 'constValue'|'makeExpression'> = {
  [HasConst]: true,
  constIndex: null,
} as const;

/**
 * Test whether an operation implements `ConsumesSlotOpTrait`.
 */
export function hasConsumesSlotTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&ConsumesSlotOpTrait {
  return (op as Partial<ConsumesSlotOpTrait>)[ConsumesSlot] === true;
}

/**
 * Test whether an operation implements `DependsOnSlotContextOpTrait`.
 */
export function hasDependsOnSlotContextTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&
    DependsOnSlotContextOpTrait {
  return (op as Partial<DependsOnSlotContextOpTrait>)[DependsOnSlotContext] === true;
}

/**
 * Test whether an operation implements `ConsumesVarsTrait`.
 */
export function hasConsumesVarsTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    ConsumesVarsTrait;
export function hasConsumesVarsTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&ConsumesVarsTrait;
export function hasConsumesVarsTrait(value: any): boolean {
  return (value as Partial<ConsumesVarsTrait>)[ConsumesVarsTrait] === true;
}

/**
 * Test whether an expression implements `UsesVarOffsetTrait`.
 */
export function hasUsesVarOffsetTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    UsesVarOffsetTrait {
  return (expr as Partial<UsesVarOffsetTrait>)[UsesVarOffset] === true;
}

/**
 * Test whether an operation or expression implements `UsesSlotIndexTrait`.
 */
export function hasUsesSlotIndexTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    UsesSlotIndexTrait;
export function hasUsesSlotIndexTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&UsesSlotIndexTrait;
export function hasUsesSlotIndexTrait(value: any): boolean {
  return (value as Partial<UsesSlotIndexTrait>)[UsesSlotIndex] === true;
}

/**
 * Test whether an operation or expression implements `HasConstTrait`.
 */
export function hasConstTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&HasConstTrait;
export function hasConstTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&HasConstTrait;
export function hasConstTrait(value: any): boolean {
  return (value as Partial<HasConstTrait>)[HasConst] === true;
}
