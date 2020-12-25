import React from "react";
import SideBar from "../SideBar/SideBar";
import "./category.css";
import { v4 as uuidv4 } from "uuid";

import ClearIcon from "@material-ui/icons/Clear";
import CategoryGrid from "./CategoryGrid";

class Category extends React.Component {
  state = {
    category: "",
    categories: [],
    editCategory: [],
    showForm: false,
    isSuccessMsg: "",
    isErrorMsg: "",
  };

  componentDidMount() {
    fetch("http://localhost:8000/allcategories")
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
        this.setState({ categories: values });
      });
  }

  categorySubmitHandler = (e) => {
    e.preventDefault();
    if (this.state.category !== "") {
      const cat = { category: this.state.category, categoryId: uuidv4() };
      fetch("http://localhost:8000/addcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) {
            const values = [...this.state.categories];
            values.push(cat);
            this.setState({
              categories: values,
              category: "",
              showForm: false,
              isSuccessMsg: "Category added successfully.",
            });
          } else {
            this.setState({
              isErrorMsg: "Can't add. Please try again after some time.",
            });
          }
        });
    }
  };
  deleteHandler = (id) => {
    const allCategory = [...this.state.categories];
    let deleteCategory = {};
    const allCategoryIns = allCategory.filter((categoryIns) => {
      if (categoryIns.categoryId === id) {
        deleteCategory = categoryIns;
      }
      return categoryIns.categoryId !== id;
    });
    fetch("http://localhost:8000/deletecategory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          this.setState({
            categories: allCategoryIns,
            isSuccessMsg: "Category deleted successfully.",
          });
        } else {
          this.setState({
            isErrorMsg: "Can't delete. Please try again after some time.",
          });
        }
      });
  };
  editHandler = (id) => {
    // alert(id);
    const editCategoryIns = this.state.categories.find(
      (element) => element.categoryId === id
    );
    console.log(editCategoryIns);
    this.setState({
      editCategory: [editCategoryIns],
      showForm: true,
    });
  };
  editCategorySubmitHandler = (e) => {
    e.preventDefault();
    const categoriesIns = [...this.state.categories];
    let categoryIns = {};
    for (let index = 0; index < categoriesIns.length; index++) {
      if (
        categoriesIns[index].categoryId ===
        this.state.editCategory[0].categoryId
      ) {
        categoriesIns[index].category = this.state.editCategory[0].category;
        categoryIns = categoriesIns[index];
      }
    }
    console.log(categoriesIns);
    this.setState({
      categories: categoriesIns,
      editCategory: [],
      showForm: false,
    });
    fetch("http://localhost:8000/editcategory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryIns),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          this.setState({
            categories: categoriesIns,
            editCategory: [],
            showForm: false,
            isSuccessMsg: "Updated successfully.",
          });
        } else {
          this.setState({
            isErrorMsg:
              "Can't update category. Please try again after some time.",
          });
        }
      });
  };

  render() {
    if (this.state.isSuccessMsg !== "" || this.state.isErrorMsg !== "") {
      setTimeout(() => {
        this.setState({
          isSuccessMsg: "",
          isErrorMsg: "",
        });
      }, 5000);
    }
    return (
      <React.Fragment>
        {true}
        <SideBar />
        <div className="category-stats">
          {this.state.showForm && (
            <div className="modal">
              <div className="drop">
                <span
                  className="modalClose"
                  onClick={() => this.setState({ showForm: false })}
                >
                  <ClearIcon />
                </span>
                <h2 className="categoryForm__header">
                  {this.state.editCategory.length > 0
                    ? "Edit Category"
                    : "Add Category"}
                </h2>
                {this.state.editCategory.length > 0 ? (
                  <form
                    className="categoryAdd__form"
                    onSubmit={this.editCategorySubmitHandler}
                  >
                    <input
                      type="text"
                      name="editCategory"
                      placeholder="Category ..."
                      value={this.state.editCategory[0].category}
                      onChange={(e) =>
                        this.setState({
                          editCategory: [
                            {
                              category: e.target.value,
                              categoryId: this.state.editCategory[0].categoryId,
                            },
                          ],
                        })
                      }
                    />
                    <br />
                    <button type="submit" className="addCategory__btn">
                      Edit Category
                    </button>
                  </form>
                ) : (
                  <form
                    className="categoryAdd__form"
                    onSubmit={this.categorySubmitHandler}
                  >
                    <input
                      type="text"
                      name="category"
                      placeholder="Category ..."
                      value={this.state.category}
                      onChange={(e) =>
                        this.setState({ category: e.target.value })
                      }
                    />
                    <br />
                    <button type="submit" className="addCategory__btn">
                      Add Category
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
          {this.state.isSuccessMsg !== "" && (
            <div className="isSuccessMsg">
              {this.state.isSuccessMsg}
              <span
                className="modalClose"
                onClick={() => this.setState({ isSuccessMsg: "" })}
              >
                <ClearIcon />
              </span>
            </div>
          )}
          {this.state.isErrorMsg !== "" && (
            <div className="isErrorMsg">
              {this.state.isErrorMsg}
              <span
                className="modalClose"
                onClick={() => this.setState({ isErrorMsg: "" })}
              >
                <ClearIcon />
              </span>
            </div>
          )}
          <button
            className="addCategoryBtn"
            onClick={() =>
              this.setState((prevState, prevProps) => ({
                showForm: !prevState.showForm,
                editCategory: [],
              }))
            }
          >
            Add Category
          </button>
          <h2 className="categoriesList__header">All Categories</h2>
          <CategoryGrid
            categories={this.state.categories}
            deleteHandler={this.deleteHandler}
            editHandler={this.editHandler}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Category;
