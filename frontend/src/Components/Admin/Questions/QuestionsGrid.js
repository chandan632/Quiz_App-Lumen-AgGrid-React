import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

export class SubCategoryGrid extends Component {
  // getCategories = () => {
  //   fetch("http://localhost:8000/allcategories", {
  //     method: "GET",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const values = [];
  //       res.forEach((categoryIns) => {
  //         values.push({
  //           category: categoryIns.category,
  //           categoryId: categoryIns.categoryId,
  //         });
  //       });
  //       console.log(values);
  //       return values;
  //     });
  // };
  state = {
    columnDefs: [
      {
        field: "category",
        minWidth: 100,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: categories },
        // valueGetter: categoryValueGetter,
        // valueSetter: categoryValueSetter,
        // cellEditorParams: {
        //   // values: ["a", "B", "c"],
        // },
      },
      {
        field: "subCategory",
        minWidth: 100,
      },
      {
        field: "tagline",
        maxWidth: 250,
      },
      {
        field: "edit",
        maxWidth: 100,
        cellRenderer: "editBtn",
        cellRendererParams: {
          editClickHandler: (id) => {
            this.props.editHandler(id);
          },
        },
      },
      {
        field: "delete",
        maxWidth: 100,
        cellRenderer: "deleteBtn",
        cellRendererParams: {
          deleteHandler: (id) => {
            this.props.deleteHandler(id);
          },
        },
      },
    ],
    paginationPageSize: 10,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      sortable: true,
      filter: true,
      resizable: true,
    },
    frameworkComponents: {
      editBtn: EditButton,
      deleteBtn: DeleteButton,
    },
    // components: {}
    gridApi: "",
    // categories: [],
  };

  componentDidMount() {
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
        this.state.columnDefs[0].cellEditorParams = { values: [...values] };
        this.setState({ categories: [...values] });
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.subCategories !== this.props.subCategories) {
      this.state.gridApi.setRowData(this.props.subCategories);
    }
  }
  onGridReady = (params) => {
    this.setState({
      gridApi: params.api,
    });
  };
  onCellValueChanged = (e) => {
    console.log(e);
  };
  render() {
    if (this.props.setsOfQuestions.length > 0) {
      this.state.gridApi.setRowData(this.props.setsOfQuestions);
    }
    return (
      <div style={{ width: "100%", height: 300 }}>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%",
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
            pagination={true}
            paginationPageSize={this.state.paginationPageSize}
            animateRows={true}
            onGridReady={this.onGridReady}
            onCellValueChanged={this.onCellValueChanged}
          />
        </div>
      </div>
    );
  }
}

function EditButton(props) {
  const editClickHandler = (e) => {
    props.editClickHandler(props.data.setId);
  };
  return (
    <span className="userEditIcon" onClick={editClickHandler}>
      <EditIcon />
    </span>
  );
}

function DeleteButton(props) {
  const deleteBtnClickHandler = (e) => {
    props.deleteHandler(props.data.setId);
  };
  return (
    <span className="userDeleteIcon" onClick={deleteBtnClickHandler}>
      <DeleteIcon />
    </span>
  );
}

async function getCategories() {
  await fetch("http://localhost:8000/allcategories", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      const values = [];
      res.forEach((categoryIns) => {
        values.push(
          categoryIns.category
          // categoryId: categoryIns.categoryId,
        );
      });
      console.log(values);
      return values;
    });
}

let categories = [];

fetch("http://localhost:8000/allcategories", {
  method: "GET",
})
  .then((res) => res.json())
  .then((res) => {
    const values = [];
    res.forEach((categoryIns) => {
      values.push(
        categoryIns.category
        // categoryId: categoryIns.categoryId,
      );
    });
    // console.log(values);
    categories = [...values];
  });

console.log(categories);

// const categoryValueGetter = (params) => {
//   console.log(params);
// };

// const categoryValueSetter = (params) => {
//   console.log("set", params);
//   params.data.name = params.newValue;
//   return true;
// };

export default SubCategoryGrid;
