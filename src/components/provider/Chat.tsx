import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IUserDataChat } from "../../interface/provider/iProvider";

function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", type: "incoming" },
    { id: 2, text: "I'm good, thank you! How about you?", type: "outgoing" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<IUserDataChat | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null); 
  const location = useLocation();

  const userDetails = location.state?.userData

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("This is userData: ", userDetails);
    setUserData(userDetails)
    
  },[])

  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageToAdd = {
      id: messages.length + 1,
      text: newMessage,
      type: "outgoing",
    };

    setMessages([...messages, messageToAdd]); 
    setNewMessage(""); 
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
  {/* Header Section */}
  <div className="flex items-center rounded-t-lg bg-blue-500 p-4 shadow-lg ">
    <img
      src={userData?.imageUrl}
      alt="User"
      className="rounded-full w-10 h-10"
    />
    <h2 className="text-white text-lg font-semibold ml-3">{userData?.name}</h2>
  </div>

  {/* Messages Section */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${
          msg.type === "outgoing" ? "justify-end" : "items-start"
        }`}
      >
        {msg.type === "incoming" && (
          <img
            src={userData?.imageUrl}
            alt="User"
            className="rounded-full w-8 h-8 mr-3"
          />
        )}
        <div
          className={`${
            msg.type === "outgoing"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-xl shadow-md max-w-xs`}
        >
          <p className="text-sm">{msg.text}</p>
        </div>
      </div>
    ))}
    {/* Invisible div to track scrolling */}
    <div ref={messagesEndRef} />
  </div>

  {/* Input Section */}
  <div className="flex items-center p-4 bg-gray-300 border-t border-gray-300">
    <textarea
      rows={1}
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
    />
    <button
      onClick={handleSendMessage}
      className="bg-blue-500 hover:bg-blue-600 text-white ml-4 px-4 py-2 rounded-full shadow-md transition-transform duration-200 transform hover:scale-105"
    >
      Send
    </button>
  </div>
</div>

  );
}

export default Chat;
