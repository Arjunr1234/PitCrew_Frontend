import  { useEffect, useRef, useState } from 'react';
import workshopImg from '../../images/providerDefaltImg.jpg';
import { useLocation } from 'react-router-dom';
import { ChatMessage } from '../../interface/user/user';
import { FaPaperPlane } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useSocket } from '../../Context/SocketIO';
import { fetchAllChatService } from '../../services/user/user';
import TypingAnimation from './TypingAnimation';


function ChatUser() {


  const location = useLocation();
  const {  bookingDetails } = location.state;
  const userName = useSelector((state:any) => state?.user?.userInfo?.name);
  const [messages, setMessages] = useState<ChatMessage[] >([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const {socket} = useSocket();
  const [isUserOnline, setIsUserOnline] = useState<boolean>();
  const [isProviderTyping, setIsProviderTyping] = useState<boolean>();
  const messagesEndRef = useRef<HTMLDivElement>(null)

  
 

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
             console.log("Thsi is the fetchedMessage: ", response.chatData.messages)
           }
        
       } catch (error) {
          console.log("Error in fetchChat: ", error);
       }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages,isProviderTyping]);

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

  

  useEffect(() => {
    if (socket) {
      socket.on("receiverIsOnline", ({ user_id }) => {
        console.log(`${user_id} is online`);
        setIsUserOnline(true)
      });
  
      socket.on("receiverIsOffline", ({ user_id }) => {
        // Handle offline status (update UI, etc.)
        console.log(`${user_id} is offline`);
        setIsUserOnline(false)
      });

      socket.on("listOnlineUsers", (onlineUsers) => {
          
          if(onlineUsers[bookingDetails?.providerId]){
            setIsUserOnline(true)
          }
      })

      socket.on("userOffline",({userId}) => {
        if(userId === bookingDetails?.providerId){
          setIsUserOnline(false)
          
        }
    })
  
      return () => {
        socket.off("receiverIsOnline");
        socket.off("receiverIsOffline");
        socket.off("userOffline");
        socket.off("listOnlineUsers")
      };
    }
  }, [socket]);

  
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
        

        socket?.emit("sendMessage", { messageDetails});
        socket?.emit("typing", {
          userId:bookingDetails.userId,
          providerId:bookingDetails.providerId,
          isTyping:false,
          typer:"USER"
        })
        setNewMessage('');
        
      } catch (error) {
          console.log("Error in sendMessage");
        
      }
      
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if(socket){
      socket.emit("typing", {
         userId:bookingDetails.userId,
         providerId:bookingDetails.providerId,
         isTyping:e.target.value.length > 0 ,
         typer:"USER"

      })
    }
};
useEffect(() => {
  if(socket){
    socket.on("typing", ({isTyping, typer}) => {
     // console.log(` ${typer} is typing------: ${isTyping}`);
     
      if(typer === 'PROVIDER'){
        setIsProviderTyping(isTyping);     
      }  
    })
    return () => {
      socket.off("typing");
    };

  }
},[socket]);


 

  return (
    <div className="flex bg-gray-400 rounded-xl h-full flex-col">
      {/* Header for image and workshop name */}
      <div className="flex flex-row rounded-xl bg-gray-300 p-2 items-center shadow-lg">
  <div className="relative">
    <img
      className="h-10 w-10 rounded-full border-1 mr-2"
      src={bookingDetails.providerDetails.logoUrl || workshopImg}
      alt="pic"
    />
    {isUserOnline && (
      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
    )}
  </div>
  <h1 className="flex-grow text-center font-semibold font-atma text-xl">
    {bookingDetails.providerDetails?.workshopName}
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
          src={bookingDetails.providerDetails?.logoUrl || workshopImg} 
          alt="User"
          className="rounded-full w-8 h-8 mr-3"
        />
      )}
      
      <div
  className={`${
    msg.sender === "user"
      ? "bg-gray-200 text-gray-700 rounded-br-none"
      : "bg-blue-500 text-white rounded-bl-none"
  } px-4 py-2 rounded-xl shadow-md max-w-xs`}
>
  <p className="text-sm">{msg.message}</p>
  <div className="flex items-center justify-between mt-1">
    <p className="text-xs text-gray-500">
      {new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </p>
    {/* Add double tick icon */}
    
    
  </div>
</div>


      {msg.sender === "user" && (
        <img
          src={bookingDetails?.userData.imageUrl} 
          alt="User"
          className="rounded-full w-8 h-8 ml-3"
        />
      )}
    </div>
  ))}

  {
    isProviderTyping ? <div className='p-5'>
      <TypingAnimation/>
    </div>:""
  }
  

  {/* Invisible div to track scrolling */}
  <div ref={messagesEndRef} />
</div>



      {/* Input message area */}
      <div className="flex items-center p-3  rounded-t-xl shadow-md">
        
        <input
          type="text"
          className="flex-grow p-3 rounded-full border-none focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleInputChange}
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
