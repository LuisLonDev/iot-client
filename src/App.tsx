import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IoTThingsList from './components/IoTThingsList';
import Thing from './components/Thing';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IoTThingsList />} />
        <Route path="/:thingId" element={<Thing />} />
      </Routes>
    </Router>
  );
};

export default App;

