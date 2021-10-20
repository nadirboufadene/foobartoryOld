import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Clock } from './components/Clock';
import { clockAddSecondAction } from './store/actions';
import { connect, useDispatch } from 'react-redux';
import { WarehouseDashboard } from './components/WarehouseDashboard';
import { RobotsFleet } from './components/RobotsFleet';
import { RobotsShape } from './store/shapes/shapes';
import { RootState } from './store/types';

function ConnectedApp(props: { robots: RobotsShape[] }) {
  const { robots } = props;
  const dispatch = useDispatch();

  const finished = robots.length >= 30;
  // updating our clock which all our system depends on
  React.useEffect(() => {
    let interval = setInterval(() => dispatch(clockAddSecondAction()), 100);
    if (finished) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [dispatch, finished]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Foobartory for Alma by Nadir Boufadene</code>
        </p>
        <Clock />
      </header>
      <WarehouseDashboard />
      <RobotsFleet />
    </div>
  );
}

const mapStateToProps = (state: RootState): { robots: RobotsShape[] } => {
  return { robots: state.warehouse.robots };
};

export const App = connect(mapStateToProps)(ConnectedApp);

export default App;
