import { ClockState } from '../reducers/clock';
import { WarehouseState } from '../reducers/warehouse';

export interface RootState {
  clock: ClockState;
  warehouse: WarehouseState;
}
