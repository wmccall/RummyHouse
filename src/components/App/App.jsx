import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import GamePage from "../Game";

import * as ROUTES from "../../constants/routes";
const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <hr />
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.GAME} component={GamePage} />
      </div>
    </Router>
  );
};
export default App;
