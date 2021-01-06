import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import "./student.css";
// import {}

import {
  expireCookie,
  isAdmin,
  isLoggedIn,
  username,
} from "./../../../util/isAuth";

export class StudentPanel extends Component {
  state = {
    isRedirectTo: "",
    username: "",
    userEmail: "",
    userId: "",
    setsOfQuestions: [],
    categorySubcategory: [],
    subCategory: [],
    clientX: "",
    clientY: "",
    questionSet: "",
    colors: [
      "tealLove",
      "danceToForget",
      "cherryblossoms",
      "dirtyFog",
      "color1",
      "color2",
      "color3",
      "color4",
    ],
  };
  getRandomColorClass = () => {
    return this.state.colors[
      Math.floor(Math.random() * this.state.colors.length)
    ];
  };
  checkAuth = () => {
    console.log("IsLoggedIn", isLoggedIn());
    console.log("IsAdmin ", isAdmin());
    if (isLoggedIn()) {
      if (isAdmin()) {
        this.setState({
          isRedirectTo: "/admin-panel",
        });
      } else {
        const user = username();
        this.setState({
          username: user.name,
          userEmail: user.userEmail,
          userId: user.userId,
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
    fetch("http://localhost:8000/getquestionssets")
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        const cat = [];
        res.forEach((resEle) => {
          const element = cat.find((ele) => ele.category === resEle.category);
          if (element !== undefined) {
            cat.forEach((catEle) => {
              if (catEle.category === element.category) {
                catEle.subCategory = [
                  ...catEle.subCategory,
                  resEle.subCategory,
                ];
              }
            });
          } else {
            cat.push({
              category: resEle.category,
              subCategory: [resEle.subCategory],
            });
          }
        });
        // console.log(cat);
        this.setState({
          setsOfQuestions: [...res],
          categorySubcategory: [...cat],
        });
      });
  }

  logoutHandler = () => {
    expireCookie("token");
    this.setState({
      isRedirectTo: "/login",
    });
  };
  categoryClickHandler = (category, e) => {
    // alert(e.clientX + " " + e.clientY);
    const findSubCategory = this.state.categorySubcategory.find(
      (ele) => ele.category === category
    );
    console.log(findSubCategory);
    this.setState({
      subCategory: [...findSubCategory.subCategory],
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };
  subCategoryClickHandler = (subCategory) => {
    const findCategory = this.state.categorySubcategory.find(
      (element) => element.subCategory.indexOf(subCategory) !== -1
    );
    const category = findCategory.category;
    console.log(category, subCategory);
    const findQuestionSet = this.state.setsOfQuestions.find(
      (ele) => ele.category === category && ele.subCategory === subCategory
    );
    console.log(findQuestionSet);
    this.setState({
      questionSet: findQuestionSet,
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isRedirectTo !== "" && (
          <Redirect to={this.state.isRedirectTo} />
        )}
        <div className="header">
          <h1 className="tagline">
            <Link to="/student-panel">Take Quiz and Grow</Link>
          </h1>
          <div className="userHandler">
            {this.state.username !== "" && (
              <React.Fragment>
                <div className="userLogout" onClick={this.logoutHandler}>
                  Logout
                </div>
                <div className="username">{this.state.username}</div>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="categorySubCategoryHeader">
          <span
            className="category__inHeader"
            onClick={() => this.setState({ questionSet: "" })}
          >
            Home
          </span>
          {this.state.categorySubcategory.map((ele, index) => {
            return (
              <React.Fragment key={index}>
                <span
                  className="category__inHeader"
                  onClick={(e) => this.categoryClickHandler(ele.category, e)}
                >
                  {ele.category}
                </span>
              </React.Fragment>
            );
          })}

          {this.state.subCategory.length > 0 && (
            <React.Fragment>
              <div
                className="subCategories"
                style={{
                  top: this.state.clientY + 10,
                  left: this.state.clientX,
                }}
              >
                {this.state.subCategory.map((uniqueEle, index) => (
                  <span
                    key={index}
                    onClick={() => this.subCategoryClickHandler(uniqueEle)}
                  >
                    {uniqueEle}
                  </span>
                ))}
              </div>
              <div
                className="closeMenu"
                onClick={() => this.setState({ subCategory: [] })}
              ></div>
            </React.Fragment>
          )}
        </div>
        {this.state.questionSet !== "" ? (
          <div
            className={`${["questionset", this.getRandomColorClass()].join(
              " "
            )}`}
          >
            <h4>{this.state.questionSet.category}</h4>
            <span>{this.state.questionSet.subCategory}</span>
            <small>{this.state.questionSet.tagline}</small>
            <Link to={{ pathname: "/quiz", state: this.state.questionSet }}>
              <button className="takeQuiz__btn">Take Quiz</button>
            </Link>
          </div>
        ) : (
          <div className="questionssets">
            {this.state.setsOfQuestions.map((setOfQuestion, index) => (
              <React.Fragment key={setOfQuestion.setId}>
                <div
                  className={`${[
                    "questionset",
                    this.getRandomColorClass(),
                  ].join(" ")}`}
                >
                  <h4>{setOfQuestion.category}</h4>
                  <span>{setOfQuestion.subCategory}</span>
                  <small>{setOfQuestion.tagline}</small>
                  <Link to={{ pathname: "/quiz", state: setOfQuestion }}>
                    <button className="takeQuiz__btn">Take Quiz</button>
                  </Link>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default StudentPanel;
