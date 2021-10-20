/**
 * Combine all reducers in this file and export the combined reducers.
 */
import clockReducer from './clock';
import warehouseReducer from './warehouse';

const reducers = {
  clock: clockReducer,
  warehouse: warehouseReducer,
};

export default reducers;
