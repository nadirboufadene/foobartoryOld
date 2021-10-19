import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RobotsShape } from '../store/shapes/shapes';

function ConnectedRobot(props: RobotsShape & DispatchProp) {
  const { timer, pendingAction, identifier, processingAction } = props;

  return (
    <>
      <div className="Robot--identifier">identifier: {identifier}</div>
      <div className="Robot--processing-action">action: {processingAction}</div>
      <div className="Robot--pending-action">next action: {pendingAction}</div>
      <div className="Robot--timer">timer: {timer}</div>
    </>
  );
}

export const Robot = connect()(ConnectedRobot);
