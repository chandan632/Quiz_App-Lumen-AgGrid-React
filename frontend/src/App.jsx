import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Register from "./Components/Authentication/Register/Register";
import Login from "./Components/Authentication/Login/Login";
import AdminPanel from "./Components/Admin/Base/AdminHome";
import StudentPanel from "./Components/Students/Base/StudentHome";
import NotFound from "./Components/NotFound/NotFound";

// Admin
import Users from "./Components/Admin/Users/Users";
import AddQuestions from "./Components/Admin/AddQuestions/AddQuestions";
import Category from "./Components/Admin/Category/Category";
import SubCategory from "./Components/Admin/SubCategory/SubCategory";
import Questions from "./Components/Admin/Questions/Questions";

// Student
import Quiz from "./Components/Students/Quiz/Quiz";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin-panel" component={AdminPanel} />
        <Route exact path="/student-panel" component={StudentPanel} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/subcategory" component={SubCategory} />
        <Route exact path="/questions" component={Questions} />
        <Route exact path="/add-questions" component={AddQuestions} />
        <Route exact path="/quiz" component={Quiz} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
