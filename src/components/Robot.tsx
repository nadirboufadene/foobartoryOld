import { CardContent, Typography } from '@mui/material';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RobotsShape } from '../store/shapes/shapes';

function ConnectedRobot(props: RobotsShape & DispatchProp) {
  const { timer, pendingAction, identifier, processingAction } = props;

  return (
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {identifier}
      </Typography>
      <Typography variant="h5" component="div">
        action: {processingAction}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        pending action: {pendingAction}
      </Typography>
      <Typography variant="body2">timer: {timer}</Typography>
    </CardContent>
  );
}

export const Robot = connect()(ConnectedRobot);
