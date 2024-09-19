import React, { useState } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const ChatApp = ({ data }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const yearMatch = prompt.match(/in (\d{4})/);
    const year = yearMatch ? yearMatch[1] : "all";
    const formattedData = formatDataForPrompt(data, year);
    const fullPrompt = `Here is the dataset: ${formattedData}\n\nQuestion: ${prompt}`;

    console.log(formattedData, "formattedData");

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        model: "llama3-8b-8192",
      });

      setResponse(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
      console.error("Error calling the LLM API:", error);
      setResponse("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDataForPrompt = (data, year) => {
    let filteredData;
    if (year === "all") {
      filteredData = data;
    } else {
      filteredData = data.filter((row) => row.work_year === year.toString());
    }

    return filteredData
      .slice(0, 5)
      .map(
        (row) =>
          `Year: ${row.work_year}, Job Title: ${row.job_title}, Salary: ${row.salary_in_usd}`
      )
      .join("; ");
  };

  return (
    <div className="text-center">
      <div >
        <h3>Data Insights Chat</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            className="w-50 rounded"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="   what is highest paid job role in 2024"
          />
          <button type="submit" className="ms-2">
            {loading ? "Loading..." : "Get Insights"}
          </button>
        </form>

        <div>
          <h4>Response:</h4>
          <p className="response mx-3">{response}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
