import React, { Component } from "react";
import "./Authentication.css";
// import { Switch, Route, Router } from "react-router-dom";

import Register from "./Register/Register";
import Login from "./Login/Login";

export class Authentication extends Component {
  render() {
    return (
      <div className="authenticationPanel">
        <Register />
      </div>
    );
  }
}

export default Authentication;
