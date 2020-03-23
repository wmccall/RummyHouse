import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { FirebaseProvider } from './context';

import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/Header';
import LandingPage from './pages/Landing';
import HomePage from './pages/Home';
import AccountPage from './pages/Account';
import AdminPage from './pages/Admin';
import GamePage from './pages/Game';
import JoinGamePage from './pages/JoinGame';

import ROUTES from './constants/routes';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const App = () => {
  return (
    <Router>
      <div>
        <FirebaseProvider>
          <Header />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <ProtectedRoute path={ROUTES.HOME} component={HomePage} />
          <ProtectedRoute path={ROUTES.ACCOUNT} component={AccountPage} />
          <ProtectedRoute path={ROUTES.ADMIN} component={AdminPage} />
          <ProtectedRoute
            path={`${ROUTES.GAME}/:gameID`}
            component={GamePage}
          />
          <ProtectedRoute
            path={`${ROUTES.JOIN_GAME}/:gameID`}
            component={JoinGamePage}
          />
          <Route
            render={() => <Redirect to={{ pathname: ROUTES.LANDING }} />}
          />
        </FirebaseProvider>
      </div>
    </Router>
  );
};
export default App;
