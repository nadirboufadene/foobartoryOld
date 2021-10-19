import { createReducer } from '@reduxjs/toolkit';
import { clockAddSecondAction } from '../actions';

export interface ClockState {
  clock: {
    count: number;
    interval: number;
  };
}

const initialState: ClockState = {
  clock: {
    count: 0,
    interval: 1000,
  },
};

const clockReducer = createReducer(initialState, builder => {
  builder
    .addCase(clockAddSecondAction, (state, action) => {
      state.clock.count =
        Math.round((state.clock.count + 0.1 + Number.EPSILON) * 10) / 10;
    })
    .addDefaultCase(state => state);
});

export default clockReducer;
