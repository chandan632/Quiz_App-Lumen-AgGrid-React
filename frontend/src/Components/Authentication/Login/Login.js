import React, { useState, useEffect } from "react";
import validator from "validator";

import "./Login.css";
import { Link, Redirect } from "react-router-dom";

import { isAdmin, isLoggedIn } from "./../../../util/isAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [isEmailError, setisEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState("");
  const [isLoginError, setIsLoginError] = useState("");
  const [isRedirectTo, setIsRedirectTo] = useState("");

  const checkAuth = () => {
    console.log("IsLoggedIn", isLoggedIn());
    console.log("IsAdmin ", isAdmin());
    if (isLoggedIn()) {
      if (isAdmin()) {
        setIsRedirectTo("/admin-panel");
      } else {
        setIsRedirectTo("/student-panel");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    if (email === "") {
      setisEmailError("This field is required!");
    }
    if (password === "") {
      setIsPasswordError("This field is required!");
    }
    if (email !== "" && password !== "") {
      fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsLoginError(res.error);
          } else {
            const token = res.token;
            localStorage.setItem("token", token);
            checkAuth();
          }
        })
        .catch((err) => {
          setIsLoginError("Something went wrong. Please try again.");
        });
    }
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);

    if (isEmailError !== "") {
      setisEmailError("");
    }
  };
  const emailBlurHandler = (e) => {
    if (!validator.isEmail(e.target.value) && email !== "") {
      setisEmailError("Enter appropriate email!");
    }
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    if (isPasswordError !== "") {
      setIsPasswordError("");
    }
  };
  if (isLoginError !== "") {
    setTimeout(() => {
      setIsLoginError("");
      setEmail("");
      setPassword("");
    }, 2000);
  }
  return (
    <React.Fragment>
      {isRedirectTo !== "" && <Redirect to={isRedirectTo} />}

      <div className="authenticationPanel">
        <div className="login">
          <h1>Login</h1>
          <form onSubmit={loginHandler}>
            <div>
              <input
                type="text"
                name="email"
                placeholder="example@gmail.com"
                className={isEmailError !== "" ? "isEmailError" : undefined}
                value={email}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
              />
              {isEmailError !== "" && <small>{isEmailError}</small>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className={
                  isPasswordError !== "" ? "isPasswordError" : undefined
                }
                value={password}
                onChange={passwordChangeHandler}
              />
              {isPasswordError !== "" && <small>{isPasswordError}</small>}
            </div>
            <button type="submit">Login</button>
          </form>
          {isLoginError !== "" && (
            <center>
              <small style={{ color: "red" }}>{isLoginError}</small>
            </center>
          )}

          <center>
            <small>
              Don't have an account <Link to="/register">register here</Link>
            </small>
          </center>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
