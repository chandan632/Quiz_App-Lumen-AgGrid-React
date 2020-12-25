import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./AdminHome.css";

import { isAdmin, isLoggedIn } from "./../../../util/isAuth";
import SideBar from "./../SideBar/SideBar";

export class AdminHome extends Component {
  state = {
    isRedirectTo: "",
  };
  checkAuth = () => {
    console.log("IsLoggedIn", isLoggedIn());
    console.log("IsAdmin ", isAdmin());
    if (isLoggedIn()) {
      if (!isAdmin()) {
        this.setState({
          isRedirectTo: "/student-panel",
        });
      }
    } else {
      this.setState({
        isRedirectTo: "/login",
      });
    }
  };

  componentDidMount() {
    this.checkAuth();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isRedirectTo !== "" && (
          <Redirect to={this.state.isRedirectTo} />
        )}
        <div className="admin">
          <SideBar />
          <div className="admin-stats">
            <div className="adminPage">
              <h1>You are now Admin</h1>
              <p>
                You have the power of{" "}
                <strong>
                  see the users, add multiple category and subcategory, edit and
                  delete them. You can add questions.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminHome;
