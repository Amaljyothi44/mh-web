import React from "react";
import { Table } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import "../AdminDetails/AdminDetails.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const UserDetailsTable = ({ details, setUserDataLoad }) => {
  let count = 0;
  const TableAnimation = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  let date = details[0].day;

  return (
    <>
      <animated.div style={TableAnimation}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="btn btn-primary mx-3 mb-3 mt-4"
          table="table-data"
          filename={`${date}_report`}
          sheet="tablexlsx"
          buttonText="Export to Excel"
        />
        <button
          onClick={() => setUserDataLoad(false)}
          className="btn btn-primary mx-3 mb-3 mt-4"
        >
          Back
        </button>
        <Table striped id="table-data">
          <thead>
            <tr>
              <th>Date</th>
              <th>Morning</th>
              <th>Noon</th>
              <th>Night</th>
            </tr>
          </thead>
          <tbody>
            {details &&
              details.map((data) => {
                return (
                  <tr key={data.day}>
                    <td>{data.day}</td>
                    <td
                      style={{ color: data.foodData.morning ? "green" : "red" }}
                    >
                      {data.foodData.morning ? "Yes" : "No"}
                    </td>
                    <td
                      style={{ color: data.foodData.morning ? "green" : "red" }}
                    >
                      {data.foodData.noon ? "Yes" : "No"}
                    </td>
                    <td
                      style={{ color: data.foodData.morning ? "green" : "red" }}
                    >
                      {data.foodData.night ? "Yes" : "No"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </animated.div>
    </>
  );
};

export default UserDetailsTable;
