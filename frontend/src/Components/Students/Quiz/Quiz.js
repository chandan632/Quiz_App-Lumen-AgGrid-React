import "./Quiz.css";
import React, { Component } from "react";

import { username, isAdmin, isLoggedIn } from "./../../../util/isAuth";
import { Redirect, Link } from "react-router-dom";

class Quiz extends Component {
  state = {
    questions: [],
    category: "",
    subCategory: "",
    setId: "",
    onQuiz: false,
    onQuestion: 0,
    disableNextBtn: false,
    time: 60,
    question: "",
    answer: "",
    answers: [],
    showResult: false,
    rightAns: [],
    wrongAns: [],
    user: "",
    username: "",
    userEmail: "",
    userId: "",
    isRedirectTo: "",
    option: "",
  };

  componentDidMount() {
    // console.log(this.props.location.state);
    this.setState({
      questions: this.props.location.state.questions,
      category: this.props.location.state.category,
      subCategory: this.props.location.state.subCategory,
      setId: this.props.location.state.setId,
      user: {
        username: username().name,
        userId: username().userID,
        userEmail: username().userEmail,
      },
    });
    console.log(username());
  }

  nextBtnHandler = () => {
    this.setState({
      time: 60,
    });
    if (this.state.onQuestion === this.state.questions.length - 2) {
      this.setState({
        disableNextBtn: true,
      });
    }
    if (this.state.onQuestion <= this.state.questions.length - 2) {
      this.setState(
        (prevState, prevProps) => ({
          answers: [...prevState.answers, prevState.answer],
          onQuestion: prevState.onQuestion + 1,
          answer: "",
          option: "",
        }),
        () => {
          this.setState({
            question: this.state.questions[this.state.onQuestion],
          });
        }
      );
    }
  };
  goAheadHandler = () => {
    let interval = "";
    this.setState({ onQuiz: true }, () => {
      if (this.state.time !== 0 && this.state.onQuiz) {
        interval = setInterval(() => {
          if (this.state.onQuestion === this.state.questions.length - 1) {
            this.setState({
              disableNextBtn: true,
            });
          }
          if (
            this.state.time === 0 &&
            this.state.onQuestion === this.state.questions.length - 1
          ) {
            return this.setState({
              onQuiz: false,
              onQuestion: 0,
              disableNextBtn: false,
              time: 60,
              answer: "",
            });
          } else {
            if (this.state.time === 0) {
              this.setState(
                (prevState, prevProps) => ({
                  answers: [...prevState.answers, prevState.answer],
                  time: 60,
                  onQuestion: prevState.onQuestion + 1,
                  answer: "",
                  option: "",
                }),
                () => {
                  this.setState({
                    question: this.state.questions[this.state.onQuestion],
                  });
                }
              );
            } else {
              this.setState((prevState, prevProps) => ({
                time: prevState.time - 1,
                question: this.state.questions[this.state.onQuestion],
              }));
            }
          }
        }, 1000);
      }
    });
    if (!this.state.onQuiz) {
      clearInterval(interval);
    }
  };
  option1Handler = (question) => {
    const questionIns = this.state.questions.find(
      (ques) => ques.question === question.question
    );
    const ans = {
      questionIns,
      rightAns: questionIns.answer === "option1",
    };
    this.setState({
      answer: ans,
      option: "option1",
    });
  };
  option2Handler = (question) => {
    const questionIns = this.state.questions.find(
      (ques) => ques.question === question.question
    );
    const ans = {
      questionIns,
      rightAns: questionIns.answer === "option2",
    };
    this.setState({
      answer: ans,
      option: "option2",
    });
  };
  option3Handler = (question) => {
    const questionIns = this.state.questions.find(
      (ques) => ques.question === question.question
    );
    const ans = {
      questionIns,
      rightAns: questionIns.answer === "option3",
    };
    console.log(ans);
    this.setState({
      answer: ans,
      option: "option3",
    });
  };
  option4Handler = (question) => {
    const questionIns = this.state.questions.find(
      (ques) => ques.question === question.question
    );
    const ans = {
      questionIns,
      rightAns: questionIns.answer === "option4",
    };
    this.setState({
      answer: ans,
      option: "option4",
    });
  };
  endTestBtnHandler = () => {
    this.setState(
      (prevSatate, prevProps) => ({
        answers: [...prevSatate.answers, prevSatate.answer],
        answer: "",
        onQuiz: false,
        onQuestion: 0,
        disableNextBtn: false,
        time: 60,
        question: "",
      }),
      () => {
        console.log(this.state.answers);
        this.setState(
          {
            showResult: true,
          },
          () => {
            this.score();
          }
        );
      }
    );
  };

  score = () => {
    const allAnswers = [...this.state.answers];
    console.log(allAnswers);
    console.log(this.state.user);
    fetch("http://localhost:8000/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allAnswers, user: this.state.user }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    const rightAns = allAnswers.filter((ans) => ans.rightAns);
    const wrongAns = allAnswers.filter((ans) => !ans.rightAns);
    this.setState({
      rightAns,
      wrongAns,
    });
  };
  checkAuth = () => {
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
  logoutHandler = () => {
    localStorage.removeItem("token");
    this.setState({
      isRedirectTo: "/login",
    });
  };
  label1ClickHandler = () => {
    this.setState({ option: "option1" });
    this.option1Handler(this.state.question);
  };
  label2ClickHandler = () => {
    this.setState({ option: "option2" });
    this.option2Handler(this.state.question);
  };
  label3ClickHandler = () => {
    this.setState({ option: "option3" });
    this.option3Handler(this.state.question);
  };
  label4ClickHandler = () => {
    this.setState({ option: "option4" });
    this.option4Handler(this.state.question);
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
            <div className="userLogout" onClick={this.logoutHandler}>
              Logout
            </div>
            <div className="username">{this.state.user.username}</div>
          </div>
        </div>
        {this.state.showResult ? (
          <div className="result">
            <h3>Result Of Your Quiz</h3>
            Correct answer was - {this.state.rightAns.length}
            <br />
            Wrong answer was - {this.state.wrongAns.length}
          </div>
        ) : (
          <div>
            {!this.state.onQuiz ? (
              <React.Fragment>
                <div className="quizSection">
                  <div className="topics">
                    <h1>Topics</h1>
                    <h3>
                      Quiz On{" "}
                      {`${this.state.subCategory}-${this.state.category}`}
                    </h3>
                  </div>
                  <div className="rules">
                    <h1>Rules</h1>
                    <ol>
                      <li>
                        This question set is including{" "}
                        {this.state.questions.length} questions.
                      </li>
                      <li>Each question will have 1 minute.</li>
                      <li>
                        After 1 minute next question will automatically appear.
                      </li>
                      <li>You can attempt only one question at a time.</li>
                      <li>
                        The result will be shown after the end of the quiz.
                      </li>
                    </ol>
                    <button
                      className="goAhead"
                      onClick={() => this.goAheadHandler()}
                    >
                      Go Ahead
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div className="onQuiz">
                <div className="quizHeader">
                  <div style={{ fontSize: "20px" }}>
                    {" "}
                    {`${this.state.subCategory}-${this.state.category}`}
                  </div>
                  <div style={{ fontSize: "20px" }}>
                    Time Left -{" "}
                    {this.state.time >= 10
                      ? this.state.time
                      : `0${this.state.time}`}
                  </div>
                </div>
                <div className="onQuizSection">
                  {this.state.questions.length > 0 &&
                    this.state.question !== "" && (
                      <React.Fragment>
                        <div className="optionsOfQuestion">
                          <div className="onQuizQuestion">
                            {
                              this.state.questions[this.state.onQuestion]
                                .question
                            }
                          </div>
                          <div
                            className="label1"
                            onClick={() => this.label1ClickHandler()}
                          >
                            <input
                              type="radio"
                              name="option"
                              id="option1"
                              checked={this.state.option === "option1"}
                              onChange={() =>
                                this.option1Handler(this.state.question)
                              }
                            />
                            <span>
                              {
                                this.state.questions[this.state.onQuestion]
                                  .option1
                              }
                            </span>
                          </div>
                          <div
                            className="label2"
                            onClick={() => this.label2ClickHandler()}
                          >
                            <input
                              type="radio"
                              name="option"
                              id="option2"
                              checked={this.state.option === "option2"}
                              onChange={() =>
                                this.option2Handler(this.state.question)
                              }
                            />
                            <span>
                              {
                                this.state.questions[this.state.onQuestion]
                                  .option2
                              }
                            </span>
                          </div>
                          <div
                            className="label3"
                            onClick={() => this.label3ClickHandler()}
                          >
                            <input
                              type="radio"
                              name="option"
                              id="option3"
                              checked={this.state.option === "option3"}
                              onChange={() =>
                                this.option3Handler(this.state.question)
                              }
                            />
                            <span>
                              {
                                this.state.questions[this.state.onQuestion]
                                  .option3
                              }
                            </span>
                          </div>
                          <div
                            className="label4"
                            onClick={() => this.label4ClickHandler()}
                          >
                            <input
                              type="radio"
                              name="option"
                              id="option4"
                              checked={this.state.option === "option4"}
                              onChange={() =>
                                this.option4Handler(this.state.question)
                              }
                            />
                            <span>
                              {
                                this.state.questions[this.state.onQuestion]
                                  .option4
                              }
                            </span>
                          </div>

                          {/* <span>
                            {
                              this.state.questions[this.state.onQuestion]
                                .option1
                            }
                          </span>
                          <br />

                          <span>
                            {
                              this.state.questions[this.state.onQuestion]
                                .option2
                            }
                          </span>
                          <br />

                          <span>
                            {
                              this.state.questions[this.state.onQuestion]
                                .option3
                            }
                          </span>
                          <br />

                          <span>
                            {
                              this.state.questions[this.state.onQuestion]
                                .option4
                            }
                          </span>
                          <br /> */}
                        </div>
                      </React.Fragment>
                    )}
                </div>
                <div className="onQuizFooter">
                  <button
                    className="nextBtn"
                    onClick={this.nextBtnHandler}
                    disabled={this.state.disableNextBtn}
                  >
                    Next
                  </button>
                  <button
                    className="endTestBtn"
                    onClick={() => {
                      this.endTestBtnHandler();
                    }}
                  >
                    End Test
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Quiz;
