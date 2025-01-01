import React from "react";
import { MdCallEnd } from "react-icons/md";
import { MdCall } from "react-icons/md";
import { useSocket } from "../../Context/SocketIO";
import { useNavigate } from "react-router-dom";
import DefaultImg from '../../images/userProfileDefaltImg.png'
import { toast } from "sonner";

type ReceivingCallModalProps = {
  
  success:boolean | null; 
  callerId:string | null;
  receiverId:string | null
  changeModal: () => void;
  callerData?:any
   
};

const UserReceivingCallModal: React.FC<ReceivingCallModalProps> = ({
  
   success,
   callerId,
   receiverId,
   changeModal,
   callerData
  
}) => {

  const {socket} = useSocket();
  const navigate = useNavigate();

  const onAccept = () => {
      toast.success("accepted")
      navigate(`/voice-call/${callerId}`, {state:true});
      socket?.emit("callAccepted", {success, callerId, receiverId, caller:'provider'});
      changeModal();
      
    }

  const handleReject = () => {
    socket?.emit("rejectCall", {rejected:true, callerId, receiverId});
    toast.error("Call is rejected");
    changeModal();  
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="w-[90%] md:w-[400px] bg-gray-900 rounded-md p-6 shadow-lg flex flex-col items-center space-y-6">
      
      <div className="text-center flex flex-col items-center">
        
        <img
          src={callerData?.image || DefaultImg}        
          alt="Caller"
          className="w-20 h-20 rounded-full border-4 border-gray-700 shadow-md"
        />
        {/* Caller Name */}
        <h3 className="text-lg font-semibold text-white mt-4">{callerData?.name || "no name"}</h3>
        <p className="text-gray-400 mt-2">is calling you...</p>
      </div>
  
      {/* Call Actions */}
      <div className="flex justify-between w-full mt-4">
        {/* Reject Call */}
        <button
          onClick={handleReject}
          className="flex-1 flex justify-center items-center bg-red-500 rounded-full p-4 shadow-lg hover:shadow-[0_10px_20px_rgba(255,0,0,0.7)] transition-transform duration-300 transform hover:scale-110"
          aria-label="Reject Call"
        >
          <MdCallEnd className="text-white text-3xl" />
        </button>
  
        {/* Accept Call */}
        <button
          onClick={onAccept}
          className="flex-1 flex justify-center items-center bg-green-500 rounded-full p-4 shadow-lg hover:shadow-[0_10px_20px_rgba(0,255,0,0.7)] transition-transform duration-300 transform hover:scale-110 ml-4"
          aria-label="Accept Call"
        >
          <MdCall className="text-white text-3xl" />
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default UserReceivingCallModal;
