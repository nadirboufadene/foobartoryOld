import { createAction } from '@reduxjs/toolkit';

export const mineFooAction = createAction<void>('MINE_FOO');
export const mineBarAction = createAction<void>('MINE_BAR');
export const assembleFoobarAction = createAction<void>('ASSEMBLE_FOOBAR');
export const assembleFoobarActionFailed = createAction<void>(
  'ASSEMBLE_FOOBAR_FAILED',
);
export const buyRobotAction = createAction<void>('BUY_ROBOT');
export const buyRobotActionFailed = createAction<void>('BUY_ROBOT_FAILED');
export const sellFoobarAction = createAction<number>('SELL_FOOBAR');

const ROBOT_PRICE = {
  EUROS: 3,
  FOOS: 6,
};

export function buyRobotIfPossible(bank: number, foosStock: number) {
  if (bank >= ROBOT_PRICE.EUROS && foosStock >= ROBOT_PRICE.FOOS)
    return buyRobotAction;
  return buyRobotActionFailed;
}

export function assembleFooBarIfPossible(foosStock: number, barsStock: number) {
  if (foosStock && barsStock) return assembleFoobarAction;
  return assembleFoobarActionFailed;
}
