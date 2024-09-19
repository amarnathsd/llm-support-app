import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#170ce7", "#82ca9d", "#ffc658", "#ff7f0e", "#d62728"];

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

    const pieData = Object.keys(experienceData).map((level) => ({
      name: level,
      value: Number(((experienceData[level] / total) * 100).toFixed(2)),
    }));

    console.log(`Pie chart data for year ${year}:`, pieData);
    return pieData;
  };

  const lineData = getLineData();
  const pieData = getPieData(selectedYear);

  console.log("Final pie chart data:", pieData);

  const renderLabel = ({ name, value }) => {
    return `${name}: ${value}%`;
  };

  return (
    <div>
      <div className="charts-container d-flex mt-5">
      <div className="line-chart p-3">
          <div className="text-center">
            <h3 className="mb-3">Line Chart: Jobs Over Time</h3>
            <LineChart width={400} height={250} data={lineData}>
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
          </div>
        </div>
       <div>
       <div className="pie-chart p-3">
          <div className="">
            <div className="d-flex justify-content-end">
              <h3 className="mb-2">Experience Level Share in </h3>
              <div className="d-flex justify-content-end mb-1 mt-1">
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="year-dropdown"
                >
                  {[...new Set(data.map((item) => item.work_year))].map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            {pieData.length > 0 ? (
              <PieChart width={350} height={230}>
                <Pie
                  dataKey="value"
                  startAngle={360}
                  endAngle={0}
                  data={pieData}
                  outerRadius={80}
                  fill="#8884d8"
                  label={renderLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <p>No data available for the selected year.</p>
            )}
          </div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default Analytics;
