import { createReducer } from '@reduxjs/toolkit';
import {
  assembleFoobarAction,
  buyRobotAction,
  clockAddSecondAction,
  mineBarAction,
  mineFooAction,
  robotFinishedTaskAction,
  robotNewOrderAction,
  sellFoobarAction,
} from '../actions';
import { RobotsShape, WarehouseShape } from '../shapes/shapes';
import { v4 as uuidv4 } from 'uuid';
import { RobotSupervisor } from '../../mechanics/RobotSupervisor';

// todo: extract in utils and reuse it to round in clock
function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
export interface WarehouseState {
  warehouse: WarehouseShape;
  robots: RobotsShape[];
}

const initialState = {
  warehouse: {
    foos: [],
    bars: [],
    foobars: [],
    bank: 0,
  },
  robots: [
    {
      timer: RobotSupervisor.getTaskTimer('MINE_FOO'),
      processingAction: 'MINE_FOO',
      pendingAction: '',
      identifier: uuidv4(),
      specialized: true,
    },
    {
      timer: RobotSupervisor.getTaskTimer('MINE_BAR'),
      processingAction: 'MINE_BAR',
      pendingAction: '',
      identifier: uuidv4(),
      specialized: false,
    },
  ],
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
        state.robots = [...state.robots, RobotSupervisor.buildNewRobot()];
      }
    })
    .addCase(mineFooAction, state => {
      state.warehouse.foos = [
        ...state.warehouse.foos,
        RobotSupervisor.buildNewFoobarElem(),
      ];
    })
    .addCase(mineBarAction, state => {
      state.warehouse.bars = [
        ...state.warehouse.bars,
        RobotSupervisor.buildNewFoobarElem(),
      ];
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
    .addCase(robotNewOrderAction, (state, action) => {
      if (state.robots) {
        const index = state.robots.findIndex(
          robot => robot.identifier === action.payload.robotIdentifier,
        );
        if (
          state.robots[index].processingAction !== action.payload.order &&
          state.robots[index].pendingAction !== action.payload.order &&
          action.payload.order !== 'RESUME_MISSION' &&
          action.payload.order !== 'WAITING_RESSOURCES'
        ) {
          state.robots[index].pendingAction = action.payload.order;
          state.robots[index].processingAction = 'CHANGE_TASK';
          state.robots[index].timer =
            RobotSupervisor.getTaskTimer('CHANGE_TASK');
        } else if (
          state.robots[index].processingAction !== action.payload.order &&
          state.robots[index].pendingAction !== action.payload.order &&
          action.payload.order === 'RESUME_MISSION'
        ) {
          state.robots[index].processingAction =
            state.robots[index].pendingAction;
          state.robots[index].timer = RobotSupervisor.getTaskTimer(
            state.robots[index].processingAction,
          );
          state.robots[index].pendingAction = '';
        } else if (
          state.robots[index].processingAction !== action.payload.order &&
          state.robots[index].pendingAction !== action.payload.order &&
          action.payload.order === 'WAITING_RESSOURCES'
        ) {
          state.robots[index].pendingAction =
            state.robots[index].processingAction;
          state.robots[index].processingAction = 'WAITING_RESSOURCES';
          RobotSupervisor.getTaskTimer('WAITING_RESSOURCES');
        }
      }
    })
    .addCase(clockAddSecondAction, state => {
      state.robots = state.robots.map(robot => {
        robot.timer = round(robot.timer - 0.1, 1);
        return robot;
      });
    })
    .addCase(robotFinishedTaskAction, (state, action) => {
      const robotIndex = state.robots.findIndex(
        robot => robot.identifier === action.payload,
      );
      const newArray = [...state.robots];
      if (newArray[robotIndex].processingAction === 'CHANGE_TASK') {
        newArray[robotIndex].processingAction =
          newArray[robotIndex].pendingAction;
        newArray[robotIndex].pendingAction = '';
      }
      newArray[robotIndex].timer = RobotSupervisor.getTaskTimer(
        newArray[robotIndex].processingAction,
      );
      state.robots = newArray;
    })
    .addDefaultCase(state => state);
});

export default warehouseReducer;
