import React, { useState } from "react";
import "./Farmer.css";

function Communication() {
  const [selectedStudent, setSelectedStudent] = useState(0);

  const [messages, setMessages] = useState([
    [
      {
        sender: "student",
        text: "Hello sir, I wanted to know about the internship starting date.",
        time: "09:30 AM",
      },
      {
        sender: "farmer",
        text: "The internship will start on 1st September.",
        time: "09:45 AM",
      },
    ],
    [
      {
        sender: "student",
        text: "Can I know what documents I need to bring?",
        time: "10:10 AM",
      },
      {
        sender: "farmer",
        text: "Please bring your college ID and internship approval letter.",
        time: "10:25 AM",
      },
    ],
    [],
  ]);

  const students = [
    {
      name: "Sirisha Rao",
      internship: "Horticulture Internship",
      avatar: "S",
    },
    {
      name: "Arjun Reddy",
      internship: "Organic Farming Internship",
      avatar: "A",
    },
    {
      name: "Priya Sharma",
      internship: "Crop Management Internship",
      avatar: "P",
    },
  ];

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedMessages = [...messages];

    updatedMessages[selectedStudent] = [
      ...updatedMessages[selectedStudent],
      {
        sender: "farmer",
        text: newMessage,
        time: "Now",
      },
    ];

    setMessages(updatedMessages);
    setNewMessage("");
  };

  return (
    <div className="farmer-page">

      <div className="page-header">
        

        <h1>Communication</h1>

        <p>
          Communicate with your selected interns.
        </p>
      </div>

      <div className="communication-container">

        <div className="student-chat-list">

          <div className="chat-list-header">
            <h3>Interns</h3>
            <span>{students.length}</span>
          </div>

          {students.map((student, index) => (
            <button
              key={student.name}
              className={
                selectedStudent === index
                  ? "chat-student active-chat-student"
                  : "chat-student"
              }
              onClick={() => setSelectedStudent(index)}
            >

              <div className="chat-avatar">
                {student.avatar}
              </div>

              <div>
                <h4>{student.name}</h4>
                <p>{student.internship}</p>
              </div>

            </button>
          ))}

        </div>

        <div className="chat-window">

          <div className="chat-header">

            <div className="chat-avatar">
              {students[selectedStudent].avatar}
            </div>

            <div>
              <h3>{students[selectedStudent].name}</h3>
              <p>{students[selectedStudent].internship}</p>
            </div>

          </div>

          <div className="messages-area">

            {messages[selectedStudent].map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "farmer"
                    ? "message farmer-message"
                    : "message student-message"
                }
              >
                <div className="message-bubble">
                  {message.text}
                </div>

                <small>{message.time}</small>
              </div>
            ))}

          </div>

          <div className="message-input-area">

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
            />

            <button onClick={sendMessage}>
              Send →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Communication;