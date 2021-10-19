import { ClockState } from '../reducers/clock';
import { RobotsState } from '../reducers/robots';
import { WarehouseState } from '../reducers/warehouse';

export interface RootState {
  clock: ClockState;
  robots: RobotsState;
  warehouse: WarehouseState;
}
