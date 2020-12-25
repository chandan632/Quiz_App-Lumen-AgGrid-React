import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import "./subcategory.css";
import { v4 as uuidv4 } from "uuid";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SubCategoryGrid from "./SubCategoryGrid";

import ClearIcon from "@material-ui/icons/Clear";

function SubCategory() {
  const [subCategory, setSubCategory] = useState("");
  const [category, setCategory] = useState("programming");
  const [categories, setCategories] = useState([]);
  const [editSubCategory, setEditSubCategory] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [isSuccessMsg, setIsSuccessMsg] = useState("");
  const [isErrorMsg, setIsErrorMsg] = useState("");
  useEffect(() => {
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
      });
    fetch("http://localhost:8000/allsubcategories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        const values = [];
        console.log(res);
        res.forEach((subCategoryIns) => {
          values.push({
            category: subCategoryIns.category,
            subCategory: subCategoryIns.subCategory,
            subCategoryId: subCategoryIns.subCategoryId,
          });
        });
        setSubcategories(values);
      });
  }, []);
  const subCategorySubmitHandler = (e) => {
    e.preventDefault();
    if (category !== "" && subCategory !== "") {
      const subcat = { subCategory, category, subCategoryId: uuidv4() };
      fetch("http://localhost:8000/addsubcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcat),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) {
            const values = [...subCategories];
            values.push(subcat);
            setSubcategories(values);
            setSubCategory("");
            setCategory("programming");
            setShowSubCategoryModal(false);
            setIsSuccessMsg("Sub-Category added successfully!");
          } else {
            setIsErrorMsg("Can't add. Please try again after some time!");
          }
        });
    }
  };
  const deleteHandler = (id) => {
    const allSubCategories = [...subCategories];
    let deleteSubCategory = {};
    const allSubCategoryIns = allSubCategories.filter((subCategoryIns) => {
      if (subCategoryIns.subCategoryId === id) {
        deleteSubCategory = subCategoryIns;
      }
      return subCategoryIns.subCategoryId !== id;
    });
    fetch("http://localhost:8000/deletesubcategory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteSubCategory),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setSubcategories(allSubCategoryIns);
          setIsSuccessMsg("Sub-Category deleted successfully!");
        } else {
          setIsErrorMsg("Can't delete. Please try again after some time!");
        }
      });
  };
  const editHandler = (id) => {
    const editSubCategoryIns = subCategories.find(
      (element) => element.subCategoryId === id
    );
    // console.log(editSubCategoryIns);
    setEditSubCategory([editSubCategoryIns]);
    setShowSubCategoryModal(true);
  };
  const editCategorySubmitHandler = (e) => {
    e.preventDefault();
    console.log(editSubCategory);
    const subCategoriesIns = [...subCategories];
    let subCategoryIns = {};
    for (let index = 0; index < subCategoriesIns.length; index++) {
      if (
        subCategoriesIns[index].subCategoryId ===
        editSubCategory[0].subCategoryId
      ) {
        subCategoriesIns[index].category = editSubCategory[0].category;
        subCategoriesIns[index].subCategory = editSubCategory[0].subCategory;
        subCategoryIns = subCategoriesIns[index];
      }
    }

    fetch("http://localhost:8000/editsubcategory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subCategoryIns),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setShowSubCategoryModal(false);
          setSubcategories(subCategoriesIns);
          setEditSubCategory([]);
          setIsSuccessMsg("Sub-Category updated successfully!");
        } else {
          setIsErrorMsg("Can't update. Please try again after some time!");
        }
      });
  };
  return (
    <React.Fragment>
      <SideBar />
      <div className="sub-category-stats">
        {showSubCategoryModal && (
          <div className="subCategoryModal">
            <div className="subCategoryDropBox">
              <span
                className="modalClose"
                onClick={() => setShowSubCategoryModal(!showSubCategoryModal)}
              >
                <ClearIcon />
              </span>
              <h2 className="categoryForm__header">
                {editSubCategory.length > 0
                  ? "Edit Sub-Category"
                  : "Add Sub-Category"}
              </h2>
              {editSubCategory.length > 0 ? (
                <form
                  className="categoryAdd__form"
                  onSubmit={editCategorySubmitHandler}
                >
                  <input
                    type="text"
                    name="editSubCategory"
                    placeholder="Sub Category ..."
                    value={editSubCategory[0].subCategory}
                    className="subCategoryInput"
                    onChange={(e) =>
                      setEditSubCategory([
                        {
                          category: editSubCategory[0].category,
                          subCategory: e.target.value,
                          subCategoryId: editSubCategory[0].subCategoryId,
                        },
                      ])
                    }
                  />
                  <br />
                  <select
                    name="editsubcategory"
                    id="editsubcategory"
                    value={editSubCategory[0].category}
                    className="subCategorySelect"
                    onChange={(e) =>
                      setEditSubCategory([
                        {
                          category: e.target.value,
                          subCategory: editSubCategory[0].subCategory,
                          subCategoryId: editSubCategory[0].subCategoryId,
                        },
                      ])
                    }
                  >
                    {categories.map((categoryIns) => (
                      <option key={categoryIns.categoryId}>
                        {categoryIns.category}
                      </option>
                    ))}
                  </select>
                  <br />
                  <button type="submit" className="addCategory__btn">
                    Edit Sub Category
                  </button>
                </form>
              ) : (
                <form
                  className="categoryAdd__form"
                  onSubmit={subCategorySubmitHandler}
                >
                  <input
                    type="text"
                    name="sub-category"
                    placeholder="Sub Category ..."
                    value={subCategory}
                    className="subCategoryInput"
                    onChange={(e) => setSubCategory(e.target.value)}
                  />
                  <br />
                  <select
                    name="subcategory"
                    id="subcategory"
                    value={category}
                    className="subCategorySelect"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((categoryIns) => (
                      <option key={categoryIns.categoryId}>
                        {categoryIns.category}
                      </option>
                    ))}
                  </select>
                  <br />
                  <button type="submit" className="addCategory__btn">
                    Add Sub Category
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
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
        <button
          className="addSubCategory"
          onClick={() => setShowSubCategoryModal(!showSubCategoryModal)}
        >
          Add SubCategory
        </button>
        <h2 className="categoriesList__header">All Sub Categories</h2>
        <SubCategoryGrid
          subCategories={subCategories}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
        />
      </div>
    </React.Fragment>
  );
}

export default SubCategory;
