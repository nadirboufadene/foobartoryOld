import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { ClockState } from '../store/reducers/clock';
import { RootState } from '../store/types';

function ConnectedClock(props: ClockState & DispatchProp) {
  const { clock } = props;

  return <div className="Clock">{clock.count}</div>;
}

const mapStateToProps = (state: RootState): ClockState => {
  return state.clock;
};

export const Clock = connect(mapStateToProps)(ConnectedClock);
