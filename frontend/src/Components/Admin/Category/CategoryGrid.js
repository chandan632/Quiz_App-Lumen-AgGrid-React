import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

class CategoryGrid extends React.Component {
  state = {
    columnDefs: [
      {
        field: "category",
        minWidth: 100,
        filter: "agTextColumnFilter",
      },
      {
        field: "edit",
        minWidth: 50,
        filter: false,
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
        filter: false,
        cellRenderer: "deleteBtn",
        cellRendererParams: {
          deleteHandler: (id) => {
            this.props.deleteHandler(id);
          },
        },
      },
    ],
    paginationPageSize: 3,
    cacheBlockSize: 3,
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
    param: "",
    lastRow: -1,
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.categories !== this.props.categories) {
      this.showData();
    }
  }
  showData = () => {
    let dataSource = {
      getRows: (param) => {
        console.log(param);
        console.log(param.request.startRow + " to " + param.request.endRow);
        fetch("http://localhost:8000/pagedcategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            limit: param.request.endRow - param.request.startRow + 1,
            offset: param.request.startRow,
            filterModel: param.request.filterModel,
            sortModel: param.request.sortModel,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            let lastRow = -1;
            if (!result || result.length === 0) {
              lastRow = param.request.startRow;
            }

            var currentLastRow = param.request.startRow + result.length;

            lastRow =
              currentLastRow <= param.request.endRow ? currentLastRow : -1;
            this.setState({
              param,
              lastRow,
            });
            param.successCallback(result, this.state.lastRow);
          });
      },
    };
    this.state.gridApi.setServerSideDatasource(dataSource);
  };
  onGridReady = (params) => {
    this.setState({
      gridApi: params.api,
    });
    this.showData();
  };

  render() {
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
            cacheBlockSize={this.state.cacheBlockSize}
            animateRows={true}
            onGridReady={this.onGridReady}
            rowModelType="serverSide"
          />
        </div>
      </div>
    );
  }
}

function EditButton(props) {
  const editClickHandler = (e) => {
    props.editClickHandler(props.data.categoryId);
  };
  return (
    <span className="userEditIcon" onClick={editClickHandler}>
      <EditIcon />
    </span>
  );
}

function DeleteButton(props) {
  const deleteBtnClickHandler = (e) => {
    console.log("All data of row", props.data);
    props.deleteHandler(props.data.categoryId);
  };
  return (
    <span className="userDeleteIcon" onClick={deleteBtnClickHandler}>
      <DeleteIcon />
    </span>
  );
}

export default CategoryGrid;
