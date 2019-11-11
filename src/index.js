import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import HospedajeLayout from "layouts/Mihospedaje/mihospedaje.jsx";


import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";

const hist = createBrowserHistory();
document.body.classList.add("white-content");
//localStorage.setItem('View_User', "");
//localStorage.setItem('View_Lodging', "");
//localStorage.setItem('jwt', "");

ReactDOM.render(
  

  <Router history={hist}>
    <Switch>
      <Route path="/mh" render={props => <HospedajeLayout {...props} />} />
      <Redirect from="/" to="/mh/home" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
