import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const fetchData = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a nice assistant.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const aiResponse = response.data.choices[0].message.content;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "user", content: userMessage },
        { sender: "AI", content: aiResponse },
      ]);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchData(userInput);
    setUserInput("");
  };

  return (
    <>
      <div className="phone">
        <div className="main-body">
          <Header />
          <div className="chat-content">
            {chatHistory.map((message, index) => (
              <div key={index} className={`response ${message.sender}`}>
                {message.content}
              </div>
            ))}
          </div>
          <form className="input-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="input-text"
              placeholder="iMessage"
              value={userInput}
              onChange={handleInputChange}
            />
            <button type="submit"> ⬆ </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;

function Header() {
  return (
    <div className="header">
      <div className="image>">
        <img
          src="https://i.pravatar.cc/44"
          alt="This is what the bot looks like right now"
        />
      </div>
      <div className="name">OpenAI 💬</div>
    </div>
  );
}
