import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IUserDataChat } from "../../interface/provider/iProvider";
import { useSocket } from "../../Context/SocketIO";
import { ChatMessage } from "../../interface/user/user";
import { fetchAllChatService } from "../../services/user/user";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TypingAnimation from "../user/TypingAnimation";

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

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [booking, setBooking] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<IUserDataChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  let { socket } = useSocket();
  const {providerInfo} = useSelector((state:RootState) => state.provider)
  const [isUserOnline, setisUserOnline] = useState<boolean>();
  const bookingData = location.state?.bookingData;
  const [isUserTyping, setIsUserTyping] = useState<boolean>()


  useEffect(() => {

    if(socket){
       socket?.emit("joinChatRoom", {userId:bookingData?.userId, providerId:bookingData?.providerId, online:"PROVIDER"})
    } 
},[socket]);

useEffect(() => {
   if(socket){

    socket.on("receiverIsOnline", ({ user_id }) => {
      // Handle online status (update UI, etc...)
      console.log(`${user_id} is online`);
      setisUserOnline(true)
    });

    socket.on("receiverIsOffline", ({ user_id }) => {
      // Handle offline status (update UI, etc.)
      console.log(`${user_id} is offline`);
      setisUserOnline(false);
    });

      socket.on("userOffline",({userId}) => {
        if(userId === bookingData?.userId){
          setisUserOnline(false)
          console.log("user went offline");
        }
    })

    socket.on("listOnlineUsers", (onlineUsers) => {
      console.log("TTTTTTTTTTTTTTTTthis sithe listonlineusers: ", onlineUsers)
      if(onlineUsers[bookingData?.userId]){
        setisUserOnline(true)
      }
  })

  return () => {
    socket.off("receiverIsOnline");
    socket.off("receiverIsOffline");
    socket.off("userOffline");
    socket.off("listOnlineUsers")
  };
  
   }
},[socket])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (bookingData) {
      
      setUserData(bookingData.userData);
      setBooking(bookingData);
  
      if (bookingData.userId && bookingData.providerId) {
        fetchMessages(bookingData.userId, bookingData.providerId);
      }
    }
    
  }, [bookingData]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async (userId: string, providerId: string) => {
    try {
      const response = await fetchAllChatService(userId, providerId);
      if (response.success) {
        console.log("These are the fetched messages: ", response.chatData.messages);
        setMessages(response.chatData.messages);
      }
    } catch (error) {
      console.log("Error in fetchMessages: ", error);
    }
  };

  useEffect(() => {
    socket?.on("receiveMessage", (messageDetails:any) => {
       
       setMessages(messageDetails.messages)
    });
    return () => {
     socket?.off("receiveMessage");
   };
 },[socket]);


  

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageDetails = {
      senderId:bookingData?.providerId,
      receiverId:bookingData?.userId,
      bookingId:bookingData._id,
      name:providerInfo?.workshopname,
      message:newMessage,
      sender:"provider"
    }

        console.log("This is messgeDetails: ", messageDetails)

        socket?.emit("sendMessage", { messageDetails});
        socket?.emit("typing", {
          userId:bookingData.userId,
          providerId:bookingData.providerId,
          isTyping:false,
          typer:"PROVIDER"
        })
        setNewMessage("") 
  };

  useEffect(() => {
    if(socket){
      socket.on("typing", ({isTyping, typer}) => {
        console.log(` ${typer} is typing: ${isTyping}`);
       
        if(typer === 'USER'){
          //toast.success("user is typing");
          setIsUserTyping(isTyping)
        }
        
      })
      return () => {
        socket.off("typing");
      };

    }
},[socket])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    if(socket){
      socket.emit("typing", {
         userId:booking.userId,
         providerId:booking.providerId,
         isTyping:e.target.value.length > 0,
         typer:"PROVIDER"

      })
    }
};

  return (
    <div className="flex flex-col h-full bg-gray-100">
  {/* Header Section */}
  <div className="flex flex-row rounded-xl bg-gray-300 p-2 items-center shadow-lg">
  <div className="relative">
    <img
      className="h-10 w-10 rounded-full border-1 mr-2"
      src={userData?.imageUrl || ''}
      alt="pic"
    />
    {isUserOnline && (
      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
    )}
  </div>
  <h1 className="flex-grow text-center font-semibold font-atma text-xl">
    {userData?.name}
  </h1>
</div>

  {/* Messages Section */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex ${
        msg.sender === "provider" ? "justify-end" : "items-start"
      }`}
    >
      {msg.sender === "user" && (
        <img
          src={userData?.imageUrl} 
          alt="Provider"
          className="rounded-full w-8 h-8 mr-3"
        />
      )}
      
      <div
        className={`${
          msg.sender === "provider"
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-700 rounded-bl-none"
        } px-4 py-2 rounded-xl shadow-md max-w-xs`}
      >
        <p className="text-sm">{msg.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {msg.sender === "provider" && (
        <img
          src={booking?.providerImage} 
          alt="provider"
          className="rounded-full w-8 h-8 ml-3"
        />
      )}
    </div>
  ))}

{
    isUserTyping ? <div className='p-5'>
      <TypingAnimation/>
    </div>:""
  }

  {/* Invisible div to track scrolling */}
  <div ref={messagesEndRef} />
</div>


  {/* Input Section */}
  <div className="flex items-center p-4 bg-gray-300 border-t border-gray-300">
    <textarea
      rows={1}
      value={newMessage}
      // onChange={(e) => setNewMessage(e.target.value)}
      onChange={handleInputChange}
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
