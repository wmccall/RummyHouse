import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import LandingPage from './pages/Landing';
import MissingPage from './pages/Missing';
import HomePage from './pages/Home';
import AccountPage from './pages/Account';
import AdminPage from './pages/Admin';
import GamePage from './pages/Game';
import JoinGamePage from './pages/JoinGame';

import ROUTES from './constants/routes';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={`${ROUTES.GAME}/:gameID`} component={GamePage} />
        <Route path={`${ROUTES.JOIN_GAME}/:gameID`} component={JoinGamePage} />
        <Route path="*" component={MissingPage} />
      </div>
    </Router>
  );
};
export default App;
