import { Stack, styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { WarehouseState } from '../store/reducers/warehouse';
import { RootState } from '../store/types';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function ConnectedWarehouseDashboard(props: WarehouseState & DispatchProp) {
  const { warehouse, robots } = props;

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="row"
      spacing={2}
    >
      <Item>foos: {warehouse.foos.length}</Item>
      <Item>bars: {warehouse.bars.length}</Item>
      <Item>foobars: {warehouse.foobars.length}</Item>
      <Item>bank: {warehouse.bank}€</Item>
      <Item>robots: {robots.length} </Item>
    </Stack>
  );
}

const mapStateToProps = (state: RootState): WarehouseState => {
  return {
    warehouse: state.warehouse.warehouse,
    robots: state.warehouse.robots,
  };
};

export const WarehouseDashboard = connect(mapStateToProps)(
  ConnectedWarehouseDashboard,
);
