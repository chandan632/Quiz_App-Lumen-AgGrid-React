import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import DeleteIcon from "@material-ui/icons/Delete";

function UserGrid(props) {
  const [columnDefs] = useState([
    { field: "name", minWidth: 200 },
    { field: "email", minWidth: 250 },
    { field: "number", minWidth: 100 },
    {
      field: "Delete",
      cellRenderer: "button",
      minWidth: 50,
      cellRendererParams: {
        deleteHandler: (id) => {
          props.deleteUserHandler(id);
        },
      },
    },
  ]);
  const [paginationPageSize] = useState(10);
  const [defaultColDef] = useState({
    flex: 1,
    minWidth: 100,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    sortable: true,
    filter: true,
    resizable: true,
  });
  const [frameworkComponents] = useState({
    button: Button,
  });
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
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          pagination={true}
          paginationPageSize={paginationPageSize}
          rowData={props.users}
          enableCellChangeFlash={true}
          animateRows={true}
        />
      </div>
    </div>
  );
}

function Button(props) {
  const deleteBtnClickHandler = (e) => {
    // console.log(props.data);
    props.deleteHandler(props.data._id.$oid);
  };
  return (
    <span className="userDeleteIcon" onClick={deleteBtnClickHandler}>
      <DeleteIcon />
    </span>
  );
}

export default UserGrid;
