import React, { useState, useEffect } from "react";
import MainTable from "./components/MainTable";
import Analytics from "./components/Analytics";
import JobTitlesTable from "./components/JobTitlesTable";
import axios from "axios";
import Papa from "papaparse";
import { Container } from "react-bootstrap";

function App() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("./dataset/salaries.csv"); 
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  return (
    <Container>
      <h1>Machine Learning Engineer Salary Dashboard</h1>
      <MainTable data={data} onYearClick={handleYearClick} />
      <Analytics data={data} />
      {selectedYear && <JobTitlesTable data={data} year={selectedYear} />}
    </Container>
  );
}

export default App;
