import React from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import "../AdminDetails/AdminDetails.css";
import { generatePdf } from "../../util/generatePdf";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { doc } from "firebase/firestore";

const AdminDetails = ({ details }) => {
  let count = 0;
  const TableAnimation = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  let date = details?.map((doc) => doc.day)[0];

  details = details.sort((a,b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))

  return (
    <>
      <animated.div style={TableAnimation}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-primary mx-3 mb-3"
          table="table-data"
          filename={`${date}_report`}
          sheet="tablexlsx"
          buttonText="Export to Excel"
        />

        <Table striped id="table-data">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Morning</th>
              <th>Noon</th>
              <th>Night</th>
            </tr>
          </thead>
          <tbody>
            {details &&
              details.map((data) => {
                return (
                  <tr key={data.id}>
                    <td>{(count = count + 1)}</td>
                    <td>{data.name.toUpperCase()}</td>
                    <td>{data.foodData.morning ? "Yes" : "No"}</td>
                    <td>{data.foodData.noon ? "Yes" : "No"}</td>
                    <td>{data.foodData.night ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </animated.div>
    </>
  );
};

export default AdminDetails;
