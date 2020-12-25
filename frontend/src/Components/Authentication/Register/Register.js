import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, Redirect } from "react-router-dom";
import validator from "validator";

import { isAdmin, isLoggedIn } from "./../../../util/isAuth";

function Register() {
  const [name, setName] = useState("");
  const [isNameError, setIsNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailError, setisEmailError] = useState("");
  const [number, setNumber] = useState("");
  const [isNumberError, setIsNumberError] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isAddingError, setIsAddingError] = useState("");
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

  const registerSubmitHandler = (e) => {
    e.preventDefault();
    if (name === "") {
      setIsNameError(true);
    }
    if (email === "") {
      setisEmailError("This field is required!");
    }
    if (number === "") {
      setIsNumberError("This field is required!");
    }
    if (password === "") {
      setIsPasswordError("This field is required!");
    }
    if (name !== "" && email !== "" && number !== "" && password !== "") {
      fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          number,
          password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsAddingError(res.error);
          } else {
            setShouldRedirect(true);
          }
        })
        .catch((err) => {
          setIsAddingError("Can't save successfully!");
        });
    }
  };

  const nameChangeHandler = (e) => {
    setName(e.target.value);
    if (isNameError) {
      setIsNameError(false);
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

  const numberChangeHandler = (e) => {
    const lengthOfNumber = number.length + 1;
    if ((e.target.value >= 0 || e.target.value <= 9) && lengthOfNumber <= 10) {
      setNumber(e.target.value);
      if (isNumberError) {
        setIsNumberError(false);
      }
    }
    if (number.length === 10 && e.target.value.length < 10) {
      setNumber(e.target.value);
    }
  };

  const numberBlurHandler = (e) => {
    if (number.length < 10 && number !== "") {
      setIsNumberError("Length of number should be 10!");
    }
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    if (isPasswordError !== "") {
      setIsPasswordError("");
    }
  };

  const passwordBlurHandler = (e) => {
    if (password.length < 5 && password !== "") {
      setIsPasswordError("Length should be greater than 5!");
    }
  };
  if (isAddingError !== "") {
    setTimeout(() => {
      setIsAddingError("");
    }, 2000);
  }
  return (
    <React.Fragment>
      {isRedirectTo !== "" && <Redirect to={isRedirectTo} />}
      <div className="authenticationPanel">
        <div className="register">
          <h1>Register</h1>
          <form onSubmit={registerSubmitHandler} autoComplete="off">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name of the user .."
                onChange={nameChangeHandler}
                value={name}
                className={isNameError ? "isNameError" : undefined}
              />
              {isNameError && <small>This field is required!</small>}
            </div>
            <div>
              <input
                type="text"
                name="email"
                placeholder="example@gmail.com"
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                value={email}
                className={isEmailError !== "" ? "isEmailError" : undefined}
              />
              {isEmailError !== "" && <small>{isEmailError}</small>}
            </div>
            <div>
              <input
                type="text"
                name="number"
                id="number"
                placeholder="Phone Number .."
                onChange={numberChangeHandler}
                onBlur={numberBlurHandler}
                value={number}
                className={isNumberError ? "isNumberError" : undefined}
              />
              {isNumberError !== "" && <small>{isNumberError}</small>}
            </div>
            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                onChange={passwordChangeHandler}
                onBlur={passwordBlurHandler}
                value={password}
                className={
                  isPasswordError !== "" ? "isPasswordError" : undefined
                }
              />
              {isPasswordError !== "" && <small>{isPasswordError}</small>}
            </div>
            <button type="submit">Register</button>
          </form>
          {isAddingError !== "" && (
            <center>
              <small style={{ color: "red" }}>{isAddingError}</small>
            </center>
          )}

          <center>
            <small>
              Already have an account <Link to="/login">login here</Link>
            </small>
          </center>
        </div>
      </div>
      {shouldRedirect && <Redirect to="/login" />}
    </React.Fragment>
  );
}

export default Register;
