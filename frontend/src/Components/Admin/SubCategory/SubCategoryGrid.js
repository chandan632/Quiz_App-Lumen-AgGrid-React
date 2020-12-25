import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

export class SubCategoryGrid extends Component {
  state = {
    columnDefs: [
      {
        field: "subCategory",
        minWidth: 100,
      },
      {
        field: "category",
        minWidth: 100,
      },
      {
        field: "edit",
        minWidth: 50,
        cellRenderer: "editBtn",
        cellRendererParams: {
          editClickHandler: (id) => {
            this.props.editHandler(id);
          },
        },
      },
      {
        field: "delete",
        minWidth: 50,
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
    gridApi: "",
  };
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
  render() {
    if (this.props.subCategories.length > 0) {
      this.state.gridApi.setRowData(this.props.subCategories);
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
          />
        </div>
      </div>
    );
  }
}

function EditButton(props) {
  const editClickHandler = (e) => {
    props.editClickHandler(props.data.subCategoryId);
  };
  return (
    <span className="userEditIcon" onClick={editClickHandler}>
      <EditIcon />
    </span>
  );
}

function DeleteButton(props) {
  const deleteBtnClickHandler = (e) => {
    props.deleteHandler(props.data.subCategoryId);
  };
  return (
    <span className="userDeleteIcon" onClick={deleteBtnClickHandler}>
      <DeleteIcon />
    </span>
  );
}

export default SubCategoryGrid;
