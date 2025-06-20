import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProfileCreation from './pages/ProfileCreation';
import ProfileList from './pages/ProfileList';

const App: React.FC = () => {
  console.log('App component is rendering');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/profile/create" />} />
        <Route path="/profile/create" element={<ProfileCreation />} />
        <Route path="/profiles" element={<ProfileList />} />
      </Routes>
    </Router>
  );
};

export default App;