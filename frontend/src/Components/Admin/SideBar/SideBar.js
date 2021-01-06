import React, { useState } from "react";
import "./sidebar.css";
import { Link, Redirect } from "react-router-dom";

import PersonIcon from "@material-ui/icons/Person";
import CategoryIcon from "@material-ui/icons/Category";
import SubjectIcon from "@material-ui/icons/Subject";
import ListIcon from "@material-ui/icons/List";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { expireCookie } from "../../../util/isAuth";

function SideBar() {
  const [isRedirectTo, setIsRedirectTo] = useState("");
  const logoutHandler = () => {
    // localStorage.removeItem("token");
    expireCookie("token");
    setIsRedirectTo("/login");
  };
  return (
    <React.Fragment>
      {isRedirectTo !== "" && <Redirect to={isRedirectTo} />}
      <div className="sidebar">
        <h2>
          <Link to="/admin-panel">Admin :)</Link>
        </h2>

        <div className="icons-box">
          <Link to="/users">
            <div className="users">
              <span className="text">Users</span>
              <span className="icons">
                <PersonIcon />
              </span>
            </div>
          </Link>
          <Link to="/category">
            <div className="category">
              <span className="text">Category</span>
              <span className="icons">
                <CategoryIcon />
              </span>
            </div>
          </Link>
          <Link to="/subcategory">
            <div className="subcategory">
              <span className="text">Sub-Category</span>
              <span className="icons">
                <SubjectIcon />
              </span>
            </div>
          </Link>
          <Link to="/questions">
            <div className="questions">
              <span className="text">Questions</span>
              <span className="icons">
                <ListIcon />
              </span>
            </div>
          </Link>
          <Link to="/add-questions">
            <div className="add-questions">
              <span className="text">Add</span>
              <span className="icons">
                <AddBoxIcon />
              </span>
            </div>
          </Link>
          <div
            className="logout"
            style={{ fontSize: "20px" }}
            onClick={logoutHandler}
          >
            Logout
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SideBar;
