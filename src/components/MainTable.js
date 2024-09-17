import React, { useState } from "react";
import { Table } from "react-bootstrap";

const MainTable = ({ data, onYearClick }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getYearlyData = () => {
    const yearlyData = data.reduce((acc, curr) => {
      const year = curr.work_year;
      const salary = parseFloat(curr.salary_in_usd);
      if (!acc[year]) {
        acc[year] = { total_jobs: 0, total_salary: 0 };
      }
      acc[year].total_jobs += 1;
      acc[year].total_salary += salary;
      return acc;
    }, {});

    return Object.keys(yearlyData).map((year) => ({
      year,
      total_jobs: yearlyData[year].total_jobs,
      average_salary: (yearlyData[year].total_salary / yearlyData[year].total_jobs).toFixed(2),
    }));
  };

  const sortedData = getYearlyData().sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th onClick={() => handleSort("year")}>Year</th>
          <th onClick={() => handleSort("total_jobs")}>Total Jobs</th>
          <th onClick={() => handleSort("average_salary")}>Average Salary (USD)</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.year} onClick={() => onYearClick(row.year)}>
            <td>{row.year}</td>
            <td>{row.total_jobs}</td>
            <td>{row.average_salary}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MainTable;
