import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Clock } from './components/Clock';
import { clockAddSecondAction } from './store/actions';
import { useDispatch } from 'react-redux';
import { WarehouseDashboard } from './components/WarehouseDashboard';
import { RobotsFleet } from './components/RobotsFleet';

function App() {
  const dispatch = useDispatch();

  // updating our clock which all our system depends on
  React.useEffect(() => {
    setInterval(() => dispatch(clockAddSecondAction()), 100);
  }, [dispatch]);

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

export default App;
