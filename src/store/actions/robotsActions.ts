import { createAction } from '@reduxjs/toolkit';
import { RobotOrder } from '../shapes/shapes';

export interface newOrderShape {
  robotIdentifier: string;
  order: RobotOrder;
}

export const robotNewOrderAction =
  createAction<newOrderShape>('ROBOT__NEW_ORDER');

export const robotFinishedTaskAction = createAction<string>(
  'ROBOT__FINISHED_TASK',
);
