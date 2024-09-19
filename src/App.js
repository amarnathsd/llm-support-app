import React, { useState, useEffect } from "react";
import MainTable from "./screen/MainTable";
import Analytics from "./screen/Analytics";
import JobTitlesTable from "./screen/JobTitlesTable";
import ChatApp from "./screen/ChatApp"; // Import the ChatApp component
import axios from "axios";
import Papa from "papaparse";


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
    setTimeout(() => {
      const element = document.getElementById("job-titles-table");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); 
  };

  return (
    <div>
      <h1 className="header p-2 text-center w-100">Machine Learning Engineer Salary Dashboard</h1>
      <p className="text-center mb-0">Click on any year in year column to see detailed view of data</p>
      <MainTable data={data} onYearClick={handleYearClick} />
      <Analytics data={data} />
      {selectedYear && (
        <div id="job-titles-table">
          <JobTitlesTable data={data} year={selectedYear} />
        </div>
      )}
      <ChatApp data={data} />
    </div>
  );
}

export default App;
