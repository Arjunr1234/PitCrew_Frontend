import React, { useEffect, useState } from 'react';
import workshopImg from '../../images/providerDefaltImg.jpg';
import { useLocation } from 'react-router-dom';
import { IProviderDetails } from '../../interface/user/user';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const chat = [
  {
    sender: "user",
    message: "Hello, I need help with my booking.",
    type: "text",
    delete: false,
    createdAt: "2024-11-27T10:00:00Z",
    updatedAt: "2024-11-27T10:00:00Z"
  },
  {
    sender: "provider",
    message: "Hi, sure! Could you please provide your booking ID?",
    type: "text",
    delete: false,
    createdAt: "2024-11-27T10:01:00Z",
    updatedAt: "2024-11-27T10:01:00Z"
  },
  {
    sender: "user",
    message: "My booking ID is 12345.",
    type: "text",
    delete: false,
    createdAt: "2024-11-27T10:02:00Z",
    updatedAt: "2024-11-27T10:02:00Z"
  },
  {
    sender: "provider",
    message: "Thank you! I’ll check the details and get back to you shortly.",
    type: "text",
    delete: false,
    createdAt: "2024-11-27T10:03:00Z",
    updatedAt: "2024-11-27T10:03:00Z"
  }
]


function ChatUser() {
  const location = useLocation();
 // const providerDetails: IProviderDetails = location.state?.providerDetails;
 const { providerDetails, bookingDetails } = location.state;
 const userName = useSelector((state:any) => state?.user?.userInfo?.name)
 

  useEffect(() => {
      console.log("This is bookingDetails/////////////: ", bookingDetails);
      console.log("This is the providerDetails: ", providerDetails)
      
  },[])

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      
      try {
        const messageDetails = {
          senderId:bookingDetails?.userId,
          receiverId:bookingDetails?.providerId,
          bookingId:bookingDetails._id,
          name:userName,
          message:newMessage,
          sender:"user"
        }

        console.log("This is messgeDetails: ", messageDetails)
        
      } catch (error) {

        
      }
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // setNewMessage('');
    }
  };
 

  return (
    <div className="flex bg-gray-400 rounded-xl h-full flex-col">
      {/* Header for image and workshop name */}
      <div className="flex flex-row rounded-xl bg-gray-300 p-2  items-center shadow-lg">
        <img
          className="h-10 w-10 rounded-full border-1 mr-2"
          src={providerDetails.logUrl || workshopImg}
          alt="pic"
        />
        <h1 className="flex-grow text-center font-semibold font-atma text-xl">
          {providerDetails.workshopName}
        </h1>
      </div>

      {/* Chat messages area */}
      <div className="flex flex-col flex-grow p-4 bg-white overflow-y-auto space-y-4">
  {chat.length > 0 ? (
    chat.map((msg, index) => (
      <div
        key={index}
        className={`${
          msg.sender === "user"
            ? "self-end bg-blue-500 text-white"
            : "self-start bg-blue-500 text-white"
        } px-3 py-5 rounded-lg shadow-md max-w-xs relative`}
      >
        <div>{msg.message}</div>
        <div className="text-xs absolute right-1 bottom-1  text-gray-700 mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    ))
  ) : (
    <div className="text-gray-500 text-center">No messages yet.</div>
  )}
</div>


      {/* Input message area */}
      <div className="flex items-center p-3  rounded-t-xl shadow-md">
        <button
          className="p-3 bg-yellow-400 rounded-full text-white hover:bg-yellow-500 mr-2"
          title="Add Emoji"
        >
          <FaSmile size={20} />
        </button>
        <input
          type="text"
          className="flex-grow p-3 rounded-full border-none focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 ml-2"
          title="Send Message"
          onClick={handleSendMessage}
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatUser;
