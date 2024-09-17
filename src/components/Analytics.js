import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // PieChart,
  // Pie,
  // Cell,
} from "recharts";

// const COLORS = ["#170ce7", "#82ca9d", "#ffc658", "#ff7f0e", "#d62728"];

// const EXPERIENCE_LEVELS = ["MI", "SE","EN","EX"];

const Analytics = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(2024);

  console.log("Data passed to Analytics component:", data);

  
  const getLineData = () => {
    const yearlyData = data.reduce((acc, curr) => {
      const year = curr.work_year; 
      if (!year) {
        console.warn("Missing work_year in record:", curr);
        return acc;
      }
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += 1;
      return acc;
    }, {});

    console.log("Line data (jobs per year):", yearlyData);

    return Object.keys(yearlyData).map((year) => ({
      year,
      total_jobs: yearlyData[year],
    }));
  };


  const getPieData = (year) => {
    const experienceData = data.reduce((acc, curr) => {
      if (curr.work_year === year.toString()) {
        const experienceLevel = curr.experience_level; 
        if (!experienceLevel) {
          console.warn("Missing experience_level in record:", curr);
          return acc;
        }
        if (!acc[experienceLevel]) {
          acc[experienceLevel] = 0;
        }
        acc[experienceLevel] += 1;
      }
      return acc;
    }, {});

    const total = Object.values(experienceData).reduce(
      (sum, value) => sum + value,
      0
    );

    console.log(`Experience data for year ${year}:`, experienceData);

    const pieData = Object.keys(experienceData).map((level) => ({
      name: level,
      value: ((experienceData[level] / total) * 100).toFixed(2), 
    }));

    console.log(`Pie chart data for year ${year}:`, pieData);
    return pieData;
  };

  const lineData = getLineData();
  const pieData = getPieData(selectedYear); 

  console.log("Final pie chart data:", pieData);

  return (
    <div>
      <h3>Line Chart: Jobs Over Time</h3>
      <LineChart width={600} height={300} data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="total_jobs"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>

      {/* <div >
        <label htmlFor="year-select">Select Year: </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >

          {[...new Set(data.map((item) => item.work_year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div> */}

      {/* <h3>Pie Chart: Experience Level Share in {selectedYear}</h3>
      {pieData.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            cx={200}
            cy={200}
            outerRadius={100}
            label
            dataKey="value"
          >
            {pieData.map((index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      ) : (
        <p>No data available for the selected year.</p>
      )} */}
    </div>
  );
};

export default Analytics;
