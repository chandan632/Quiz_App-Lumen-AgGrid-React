import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import "./AddQuestions.css";
import { v4 as uuidv4 } from "uuid";

import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

function AddQuestions() {
  const [isSuccessMsg, setIsSuccessMsg] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState("");
  const [inputFields, setInputFields] = useState([
    {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "option1",
      questionId: uuidv4(),
    },
  ]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [isError, setIsError] = useState("");
  const [subCategoriesHandle, setSubcategoriesHandle] = useState([]);
  const [tagline, setTagline] = useState("");
  const defaultData = () => {
    fetch("http://localhost:8000/allcategories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        const values = [];
        console.log(res);
        res.forEach((categoryIns) => {
          values.push({
            category: categoryIns.category,
            categoryId: categoryIns.categoryId,
          });
        });
        setCategories(values);
        setCategory(values[0].category);
        fetch("http://localhost:8000/findsubcategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: values[0].category }),
        })
          .then((res) => res.json())
          .then((res) => {
            const values = [];
            res.forEach((subCategoryIns) => {
              values.push({
                category: subCategoryIns.category,
                subCategory: subCategoryIns.subCategory,
                subCategoryId: subCategoryIns.subCategoryId,
              });
            });
            setSubCategory(values[0].subCategory);
            setSubcategoriesHandle(values);
          });
      });
  };
  useEffect(() => {
    defaultData();
  }, []);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const questions = inputFields.filter((inputField) => {
      if (
        inputField.question === "" ||
        inputField.option1 === "" ||
        inputField.option2 === "" ||
        inputField.option3 === "" ||
        inputField.option4 === "" ||
        inputField.answer === ""
      ) {
        setIsError("All fields are required");
        return false;
      } else {
        return true;
      }
    });

    if (questions.length > 0) {
      const setOfQuestions = {
        category,
        subCategory,
        questions,
        tagline,
        setId: uuidv4(),
      };
      console.log(setOfQuestions);
      if (isError === "") {
        fetch("http://localhost:8000/addquestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(setOfQuestions),
        })
          .then((res) => res.json())
          .then((res) => {
            if (!res.error) {
              setInputFields([
                {
                  question: "",
                  option1: "",
                  option2: "",
                  option3: "",
                  option4: "",
                  answer: "option1",
                  questionId: uuidv4(),
                },
              ]);
              setTagline("");
              defaultData();
              setIsSuccessMsg("Question set added successfully!");
            } else {
              setIsErrorMsg("Can't add. Please try again after some time.");
            }
          });
      }
    }
  };
  if (isError) {
    setTimeout(() => {
      setIsError("");
    }, 2000);
  }
  const setCategoryHandler = (e) => {
    setCategory(e.target.value);
    fetch("http://localhost:8000/findsubcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: e.target.value }),
    })
      .then((res) => res.json())
      .then((res) => {
        const values = [];
        res.forEach((subCategoryIns) => {
          values.push({
            category: subCategoryIns.category,
            subCategory: subCategoryIns.subCategory,
            subCategoryId: subCategoryIns.subCategoryId,
          });
        });
        if (values.length > 0) {
          setSubCategory(values[0].subCategory);
        } else {
          setSubCategory("No subCategory");
          setIsError("Please create subcategory under this category");
        }

        setSubcategoriesHandle(values);
      });
  };
  if (isSuccessMsg !== "" || isErrorMsg !== "") {
    setTimeout(() => {
      setIsErrorMsg("");
      setIsSuccessMsg("");
    }, 5000);
  }
  const csvUploadHandler = (e) => {
    e.preventDefault();
  };
  return (
    <React.Fragment>
      <SideBar />
      <div className="add-questions-stats">
        <div className="formSection">
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
          <h2>Add Question Through HTML form</h2>
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
                  {subCategoriesHandle.length > 0 ? (
                    subCategoriesHandle.map((subCategoryIns) => (
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
              Save
            </button>
          </form>
        </div>
        {/* <div className="addQuestionsThroughCsv">
          <h3>Upload File Through CSV file</h3>
          <form onSubmit={csvUploadHandler}>
            <input type="file" name="csv" id="csv" onChange={} />
            <button type="submit">Upload</button>
          </form>
        </div> */}
      </div>
    </React.Fragment>
  );
}

export default AddQuestions;
