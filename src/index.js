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
/*
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: ' AKIAZO7ZT7EYV25R754V',
  secretAccessKey: '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'
});
s3.listBuckets({},(err,data)=>{
  if(err) throw err;
  console.log(data);
});*/



ReactDOM.render(
  

  <Router history={hist}>
    <Switch>
      <Route path="/mh" render={props => <HospedajeLayout {...props} />} />
      <Redirect from="/" to="/mh/home" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
