/**
 * Combine all reducers in this file and export the combined reducers.
 */
import clockReducer from './clock';
import robotsReducer from './robots';
import warehouseReducer from './warehouse';

const reducers = {
  clock: clockReducer,
  robots: robotsReducer,
  warehouse: warehouseReducer,
};

export default reducers;
