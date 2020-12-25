"use strict";
import "regenerator-runtime/runtime.js";
import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import "./Questions.css";
import { v4 as uuidv4 } from "uuid";

import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import QuestionsGrid from "./QuestionsGrid";

function Questions() {
  const [showModal, setShowModal] = useState(false);
  const [setsOfQuestions, setSetsOfQuestions] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [isError, setIsError] = useState("");
  const [tagline, setTagline] = useState("");
  const [categories, setCategories] = useState([]);
  const [questionSet, setQuestionSet] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [isSuccessMsg, setIsSuccessMsg] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState("");
  const [colors, setColors] = useState([
    "tealLove",
    "danceToForget",
    "cherryblossoms",
    "dirtyFog",
    "color1",
    "color2",
    "color3",
    "color4",
  ]);
  useEffect(() => {
    fetch("http://localhost:8000/getquestionssets")
      .then((res) => res.json())
      .then((res) => {
        setSetsOfQuestions([...res]);
      });
    fetch("http://localhost:8000/allcategories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        const values = [];
        res.forEach((categoryIns) => {
          values.push({
            category: categoryIns.category,
            categoryId: categoryIns.categoryId,
          });
        });
        setCategories(values);
      });
  }, []);
  const getRandomColorClass = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const deleteHandler = (setId) => {
    const filteredSets = setsOfQuestions.filter((set) => set.setId !== setId);
    fetch("http://localhost:8000/deletesetofquestion", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setId }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setSetsOfQuestions(filteredSets);
          setIsSuccessMsg("Deleted successfully.");
        } else {
          setIsErrorMsg("Can't delete. Please try again after some time.");
        }
      });
  };
  const editHandler = (setId) => {
    const questionSetIns = setsOfQuestions.find((ele) => ele.setId === setId);
    setQuestionSet(questionSetIns);
    setInputFields(questionSetIns.questions);
    setCategory(questionSetIns.category);
    setSubCategory(questionSetIns.subCategory);
    fetch("http://localhost:8000/findsubcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: questionSetIns.category }),
    })
      .then((resI) => resI.json())
      .then((resI) => {
        const valuesI = [];
        resI.forEach((subCategoryIns) => {
          valuesI.push({
            category: subCategoryIns.category,
            subCategory: subCategoryIns.subCategory,
            subCategoryId: subCategoryIns.subCategoryId,
          });
        });
        setSubCategories(valuesI);
      });
    setTagline(questionSetIns.tagline);
    setShowModal(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const setsOfQuestionsIns = [...setsOfQuestions];
    let ele = {};
    for (let i = 0; i < setsOfQuestionsIns.length; i++) {
      if (setsOfQuestionsIns[i].setId === questionSet.setId) {
        setsOfQuestionsIns[i].category = category;
        setsOfQuestionsIns[i].subCategory = subCategory;
        setsOfQuestionsIns[i].tagline = tagline;
        setsOfQuestionsIns[i].questions = inputFields;
        ele = setsOfQuestionsIns[i];
      }
    }
    fetch("http://localhost:8000/editquestionset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setId: questionSet.setId, setOfQuestion: ele }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setSetsOfQuestions(setsOfQuestionsIns);
          setShowModal(false);
          setIsSuccessMsg("Updated successfully.");
        } else {
          setIsErrorMsg("Can't update. Please try again after some time.");
        }
      });
  };
  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "option1",
      questionId: uuidv4(),
    });
    setInputFields(values);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setInputFields(values);
    }
  };
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "question") {
      values[index].question = event.target.value;
    } else if (event.target.name === "option1") {
      values[index].option1 = event.target.value;
    } else if (event.target.name === "option2") {
      values[index].option2 = event.target.value;
    } else if (event.target.name === "option3") {
      values[index].option3 = event.target.value;
    } else if (event.target.name === "option4") {
      values[index].option4 = event.target.value;
    } else {
      values[index].answer = event.target.value;
    }
    setInputFields(values);
  };

  if (isError || isSuccessMsg !== "" || isErrorMsg !== "") {
    setTimeout(() => {
      setIsError(false);
      setIsSuccessMsg("");
      setIsErrorMsg("");
    }, 5000);
  }
  const setCategoryHandler = (e) => {
    setCategory(e.target.value);
    fetch("http://localhost:8000/findsubcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: e.target.value }),
    })
      .then((resI) => resI.json())
      .then((resI) => {
        const valuesI = [];
        resI.forEach((subCategoryIns) => {
          valuesI.push({
            category: subCategoryIns.category,
            subCategory: subCategoryIns.subCategory,
            subCategoryId: subCategoryIns.subCategoryId,
          });
        });
        setSubCategory(valuesI[0].subCategory);
        setSubCategories(valuesI);
      });
  };
  return (
    <div>
      <SideBar />
      <div className="questionssets">
        {isSuccessMsg !== "" && (
          <div className="isSuccessMsg">
            {isSuccessMsg}{" "}
            <span className="modalClose" onClick={() => setIsSuccessMsg("")}>
              <ClearIcon />
            </span>
          </div>
        )}
        {isErrorMsg !== "" && (
          <div className="isErrorMsg">
            {isErrorMsg}
            <span className="modalClose" onClick={() => setIsErrorMsg("")}>
              <ClearIcon />
            </span>
          </div>
        )}

        <h2>All Questions Set</h2>
        <QuestionsGrid
          setsOfQuestions={setsOfQuestions}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
        />
      </div>
      {showModal && (
        <div className="questionSetModal">
          <div className="questionSetModalDropBox">
            <span
              className="modalClose"
              onClick={() => setShowModal(!showModal)}
            >
              <ClearIcon />
            </span>
            <div>
              <form className="addQuestionsManualForm" onSubmit={handleSubmit}>
                <div className="formSection__header">
                  <div>
                    <span>Category</span>
                    <select
                      className="category__select"
                      name="category"
                      id="category"
                      value={category}
                      onChange={(e) => setCategoryHandler(e)}
                    >
                      {categories.map((category, index) => (
                        <option key={category.categoryId}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span>SubCategory</span>
                    <select
                      className="subCategory__select"
                      name="sub-category"
                      id="sub-category"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      {subCategories.length > 0 ? (
                        subCategories.map((subCategoryIns) => (
                          <option key={subCategoryIns.subCategoryId}>
                            {subCategoryIns.subCategory}
                          </option>
                        ))
                      ) : (
                        <option>Create subcategory of this category</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <span style={{ marginRight: "10px" }}>Tagline</span>
                    <input
                      type="text"
                      name="tagline"
                      placeholder="Tagline .."
                      className="taglineInput"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>
                </div>

                {inputFields.map((inputField, index) => (
                  <React.Fragment key={`${inputField}-${index}`}>
                    <div className="row">
                      <input
                        type="text"
                        name="question"
                        id="question"
                        placeholder="Question .."
                        className="question"
                        value={inputField.question}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <input
                        type="text"
                        name="option1"
                        placeholder="Option 1 .."
                        className="option1"
                        value={inputField.option1}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <input
                        type="text"
                        name="option2"
                        placeholder="Option 2 .."
                        className="option2"
                        value={inputField.option2}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <input
                        type="text"
                        name="option3"
                        placeholder="Option 3 .."
                        className="option3"
                        value={inputField.option3}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <input
                        type="text"
                        name="option4"
                        placeholder="Option 4 .."
                        className="option4"
                        value={inputField.option4}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                      <select
                        name="answer"
                        id="answer"
                        onChange={(event) => handleInputChange(index, event)}
                        value={inputField.answer}
                      >
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                        <option value="option4">Option 4</option>
                      </select>
                      <span onClick={() => handleRemoveFields(index)}>
                        <RemoveIcon />
                      </span>
                      <span onClick={() => handleAddFields()}>
                        <AddIcon />
                      </span>
                    </div>
                  </React.Fragment>
                ))}
                {isError !== "" && (
                  <small style={{ color: "red", margin: "10px 0" }}>
                    {isError}
                  </small>
                )}
                <button type="submit" className="saveBtn">
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Questions;
