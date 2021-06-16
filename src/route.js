import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Users from "./pages/users";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Users />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;