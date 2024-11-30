import React, { useEffect, useState } from 'react';
import workshopImg from '../../images/providerDefaltImg.jpg';
import { useLocation } from 'react-router-dom';
import { ChatMessage, IProviderDetails } from '../../interface/user/user';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useSocket } from '../../Context/SocketIO';
import { fetchAllChatService } from '../../services/user/user';

// const chat:ChatMessage[] = [
//   {
//     sender: "user",
//     message: "Hello, I need help with my booking.",
//     type: "text",
//     delete: false,
//     createdAt: "2024-11-27T10:00:00Z",
//     updatedAt: "2024-11-27T10:00:00Z"
//   },
//   {
//     sender: "provider",
//     message: "Hi, sure! Could you please provide your booking ID?",
//     type: "text",
//     delete: false,
//     createdAt: "2024-11-27T10:01:00Z",
//     updatedAt: "2024-11-27T10:01:00Z"
//   },
//   {
//     sender: "user",
//     message: "My booking ID is 12345.",
//     type: "text",
//     delete: false,
//     createdAt: "2024-11-27T10:02:00Z",
//     updatedAt: "2024-11-27T10:02:00Z"
//   },
//   {
//     sender: "provider",
//     message: "Thank you! I’ll check the details and get back to you shortly.",
//     type: "text",
//     delete: false,
//     createdAt: "2024-11-27T10:03:00Z",
//     updatedAt: "2024-11-27T10:03:00Z"
//   }
// ]


function ChatUser() {


  const location = useLocation();
  const { providerDetails, bookingDetails } = location.state;
  const userName = useSelector((state:any) => state?.user?.userInfo?.name);
  const [messages, setMessages] = useState<ChatMessage[] >([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const {socket} = useSocket();
 

  useEffect(() => {

       if(socket){
          socket?.emit("joinChatRoom", {userId:bookingDetails?.userId, providerId:bookingDetails?.providerId, online:"USER"})
       } 
  },[socket]);

  const fetchChat = async() => {
       try {
           const response = await fetchAllChatService(bookingDetails?.userId, bookingDetails?.providerId);
           if(response.success){
             setMessages(response.chatData.messages)
           }
        
       } catch (error) {
          console.log("Error in fetchChat: ", error);
       }
  }

  useEffect(() => {
      fetchChat()
  },[]);

  useEffect(() => {
     socket?.on("receiveMessage", (messageDetails:any) => {
        
        setMessages(messageDetails.messages)
     });
     return () => {
      socket?.off("receiveMessage");
    };
  },[socket]);

  
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

        socket?.emit("sendMessage", { messageDetails});
        setNewMessage("")
        
        
      } catch (error) {

        
      }
      
    }
  };
 

  return (
    <div className="flex bg-gray-400 rounded-xl h-full flex-col">
      {/* Header for image and workshop name */}
      <div className="flex flex-row rounded-xl bg-gray-300 p-2  items-center shadow-lg">
        <img
          className="h-10 w-10 rounded-full border-1 mr-2"
          src={providerDetails?.logoUrl || workshopImg}
          alt="pic"
        />
        <h1 className="flex-grow text-center font-semibold font-atma text-xl">
          {providerDetails.workshopName}
        </h1>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex ${
        msg.sender === "user" ? "justify-end" : "items-start"
      }`}
    >
      {msg.sender === "provider" && (
        <img
          src={providerDetails?.logoUrl || workshopImg} 
          alt="User"
          className="rounded-full w-8 h-8 mr-3"
        />
      )}
      
      <div
        className={`${
          msg.sender === "user"
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-700 rounded-bl-none"
        } px-4 py-2 rounded-xl shadow-md max-w-xs`}
      >
        <p className="text-sm">{msg.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {msg.sender === "user" && (
        <img
          src={bookingDetails?.userImage} 
          alt="User"
          className="rounded-full w-8 h-8 ml-3"
        />
      )}
    </div>
  ))}

  {/* Invisible div to track scrolling */}
  {/* <div ref={messagesEndRef} /> */}
</div>



      {/* Input message area */}
      <div className="flex items-center p-3  rounded-t-xl shadow-md">
        
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
