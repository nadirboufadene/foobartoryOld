import { createReducer } from '@reduxjs/toolkit';
import {
  assembleFoobarAction,
  buyRobotAction,
  mineBarAction,
  mineFooAction,
  sellFoobarAction,
} from '../actions';
import { FoobarElem, WarehouseShape } from '../shapes/shapes';
import { v4 as uuidv4 } from 'uuid';

export interface WarehouseState {
  warehouse: WarehouseShape;
}

const initialFoobarElem: FoobarElem = {
  identifier: uuidv4(),
};

const initialState = {
  warehouse: {
    foos: [],
    bars: [],
    foobars: [],
    bank: 0,
  },
} as WarehouseState;

const warehouseReducer = createReducer(initialState, builder => {
  builder
    .addCase(assembleFoobarAction, state => {
      if (state.warehouse.bars.length && state.warehouse.foos.length) {
        state.warehouse.foos = [...state.warehouse.foos.slice(1)];
        if (Math.random() < 0.6) {
          state.warehouse.foobars = [
            ...state.warehouse.foobars,
            {
              foo: state.warehouse.foos[0],
              bar: state.warehouse.bars[0],
            },
          ];
          state.warehouse.bars = [...state.warehouse.bars.slice(1)];
        }
      }
    })
    .addCase(buyRobotAction, state => {
      if (state.warehouse.foos.length >= 6 && state.warehouse.bank >= 3) {
        state.warehouse.foos = [...state.warehouse.foos.slice(6)];
        state.warehouse.bank -= 3;
      }
    })
    .addCase(mineFooAction, state => {
      state.warehouse.foos = [...state.warehouse.foos, initialFoobarElem];
    })
    .addCase(mineBarAction, state => {
      state.warehouse.bars = [...state.warehouse.bars, initialFoobarElem];
    })
    .addCase(sellFoobarAction, (state, action) => {
      const AMOUNT_TO_SELL = 5;
      if (state.warehouse.foobars.length >= AMOUNT_TO_SELL) {
        state.warehouse.bank += AMOUNT_TO_SELL;
        state.warehouse.foobars = [
          ...state.warehouse.foobars.slice(AMOUNT_TO_SELL),
        ];
      }
    })
    .addDefaultCase(state => state);
});

export default warehouseReducer;
