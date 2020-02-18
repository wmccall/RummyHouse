import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginSignup from "./LoginSignup";
import Logout from "./Logout";

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
        <Link to={ROUTES.HOME}>Rummy House</Link>
        <LoginSignup />
        <LoginSignup isLogin={false} />
        <Logout />
        <hr />
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
