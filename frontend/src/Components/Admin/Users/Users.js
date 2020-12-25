import React from "react";
import "./Users.css";

import SideBar from "./../SideBar/SideBar";
import UserGrid from "./UserGrid";

import ClearIcon from "@material-ui/icons/Clear";

class Users extends React.Component {
  state = {
    users: [],
    deleteId: [],
    isErrorMsg: false,
    isDeletedMsg: false,
  };
  componentDidMount() {
    fetch("http://localhost:8000/allusers")
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          users: [...res],
        });
      });
  }
  deleteUserHandler = (id) => {
    alert(id);
    const allUsers = [...this.state.users];
    const allUsersIns = allUsers.filter((user) => user._id !== id);
    try {
      fetch("http://localhost:8000/deleteuser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) {
            fetch("http://localhost:8000/allusers")
              .then((res) => res.json())
              .then((res) => {
                this.setState({
                  users: [...res],
                  isDeletedMsg: true,
                });
              });
          } else {
            this.setState({
              isErrorMsg: true,
            });
          }
        });
    } catch (error) {
      if (error) {
        this.setState({
          isErrorMsg: true,
        });
      }
    }
  };
  clearMsg = () => {
    this.setState({
      isErrorMsg: false,
      isDeletedMsg: false,
    });
  };
  render() {
    if (this.state.isErrorMsg || this.state.isDeletedMsg) {
      setTimeout(() => {
        this.setState({
          isErrorMsg: false,
          isDeletedMsg: false,
        });
      }, 5000);
    }
    return (
      <React.Fragment>
        <SideBar />
        <div className="users-stats">
          {this.state.isErrorMsg && (
            <div className="errorMsg">
              Can't delete. Please try again after some time.
              <span className="clearIcon" onClick={this.clearMsg}>
                <ClearIcon />
              </span>
            </div>
          )}
          {this.state.isDeletedMsg && (
            <div className="deleteMsg">
              User deleted successfully.
              <span className="clearIcon" onClick={this.clearMsg}>
                <ClearIcon />
              </span>
            </div>
          )}
          <h3>All Users</h3>
          <UserGrid
            users={this.state.users}
            deleteUserHandler={this.deleteUserHandler}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Users;
