import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { WarehouseState } from '../store/reducers/warehouse';
import { RootState } from '../store/types';

function ConnectedWarehouseDashboard(props: WarehouseState & DispatchProp) {
  const { warehouse } = props;

  return (
    <>
      <div className="Foos">foos: {warehouse.foos.length}</div>
      <div className="Bars">bars: {warehouse.bars.length}</div>
      <div className="Foobars">foobars: {warehouse.foobars.length}</div>
      <div className="Bank">bank: {warehouse.bank}€</div>
    </>
  );
}

const mapStateToProps = (state: RootState): WarehouseState => {
  return state.warehouse;
};

export const WarehouseDashboard = connect(mapStateToProps)(
  ConnectedWarehouseDashboard,
);
