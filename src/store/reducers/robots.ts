import { createReducer } from '@reduxjs/toolkit';
import {
  robotNewOrderAction,
  buyRobotAction,
  clockAddSecondAction,
  robotFinishedTaskAction,
} from '../actions';
import { RobotsShape } from '../shapes/shapes';
import { v4 as uuidv4 } from 'uuid';
import { RobotSupervisor } from '../../mechanics/RobotSupervisor';

// todo: extract in utils and reuse it to round in clock
function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export interface RobotsState {
  robots: RobotsShape[];
}

const initialState: RobotsState = {
  robots: [
    {
      timer: RobotSupervisor.getTaskTimer('MINE_FOO'),
      processingAction: 'MINE_FOO',
      pendingAction: '',
      identifier: uuidv4(),
      specialized: true,
      waitingRessources: false,
    },
    {
      timer: RobotSupervisor.getTaskTimer('MINE_BAR'),
      processingAction: 'MINE_BAR',
      pendingAction: '',
      identifier: uuidv4(),
      specialized: false,
      waitingRessources: false,
    },
  ],
};

const robotsReducer = createReducer(initialState, builder => {
  builder
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
        } else if (
          state.robots[index].processingAction !== action.payload.order &&
          state.robots[index].pendingAction !== action.payload.order &&
          action.payload.order === 'WAITING_RESSOURCES'
        ) {
          state.robots[index].pendingAction =
            state.robots[index].processingAction;
          state.robots[index].processingAction = 'WAITING_RESSOURCES';
        }
      }
    })
    .addCase(buyRobotAction, state => {
      state.robots = [...state.robots, RobotSupervisor.buildNewRobot()];
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

export default robotsReducer;
