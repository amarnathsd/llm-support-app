import React from "react";
import { Table } from "react-bootstrap";

const JobTitlesTable = ({ data, year }) => {
  const getJobTitlesData = () => {
    const jobTitleData = data.reduce((acc, curr) => {
      if (curr.work_year === year.toString()) {
        if (!acc[curr.job_title]) {
          acc[curr.job_title] = 0;
        }
        acc[curr.job_title] += 1;
      }
      return acc;
    }, {});

    return Object.keys(jobTitleData).map((job_title) => ({
      job_title,
      count: jobTitleData[job_title],
    }));
  };

  const jobTitlesData = getJobTitlesData();

  return (
    <div className="d-flex justify-content-center text-center">
      <div>
        <h3>Job Titles for {year}</h3>
        <div className="table-container">
      <Table className="custom-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Number of Jobs</th>
          </tr>
        </thead>
        <tbody>
          {jobTitlesData.map((row) => (
            <tr key={row.job_title}>
              <td>{row.job_title}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
      </div>
    </div>
  );
};

export default JobTitlesTable;
