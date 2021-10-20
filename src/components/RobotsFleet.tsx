import { Grid } from '@mui/material';
import React from 'react';
import { connect, DispatchProp, useDispatch } from 'react-redux';
import { RobotSupervisor } from '../mechanics/RobotSupervisor';
import { robotFinishedTaskAction, robotNewOrderAction } from '../store/actions';
import { WarehouseState } from '../store/reducers/warehouse';
import { RootState } from '../store/types';
import { Robot } from './Robot';

function ConnectedRobotsFleet(props: WarehouseState & DispatchProp) {
  const { warehouse, robots } = props;
  const dispatch = useDispatch();

  React.useEffect(() => {
    robots.forEach(robot => {
      if (robot.timer <= 0) {
        dispatch({ type: robot.processingAction });
        dispatch(robotFinishedTaskAction(robot.identifier));
      }
    });
    const newRobotsOrders = RobotSupervisor.getNewOrders(robots, warehouse);
    if (newRobotsOrders) {
      newRobotsOrders.forEach(order => {
        dispatch(robotNewOrderAction(order));
      });
    }
  }, [dispatch, robots, warehouse]);

  return (
    <Grid container spacing={2} className="Robot">
      {robots.map(robot => (
        <Grid item xs={4} key={robot.identifier}>
          <Robot
            timer={robot.timer}
            pendingAction={robot.pendingAction}
            processingAction={robot.processingAction}
            identifier={robot.identifier}
            key={robot.identifier}
            specialized={robot.specialized}
          />
        </Grid>
      ))}
    </Grid>
  );
}

const mapStateToProps = (state: RootState): WarehouseState => {
  return {
    robots: state.warehouse.robots,
    warehouse: state.warehouse.warehouse,
  };
};

export const RobotsFleet = connect(mapStateToProps)(ConnectedRobotsFleet);
