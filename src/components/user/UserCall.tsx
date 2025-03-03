import  { useState, useRef, useEffect } from "react";
import { MdCallEnd } from "react-icons/md";
import { useSocket } from "../../Context/SocketIO";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const servers: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:bn-turn2.xirsys.com"] },
    {
      username:
        "o8_s2lbVKiqxpNa5Ntw5kG_h7g9zYj-AbK49RHWtnH26b_exoUgSkD5MrvzAQkpMAAAAAGcrwiBzYXJhdGhz",
      credential: "90886c3c-9c74-11ef-8e6e-0242ac140004",
      urls: [
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
        "turns:bn-turn2.xirsys.com:443?transport=tcp",
        "turns:bn-turn2.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

const VideoCallUI = () => {
  
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const {socket} = useSocket();
  const {providerId} = useParams()
  const {userInfo} = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | undefined>();
  const location = useLocation()
  const [callingState, setCallingState] = useState<"calling" | "connected" | "callEnded">("calling");



  useEffect(() => {
      // console.log("This is providerID: userId: ", providerId, userInfo?.id)
        if(!location.state){
          socket?.emit("createRoomForCall", {providerId:providerId, userId:userInfo?.id + "", caller:"user", callerData:{image:userInfo?.image, name:userInfo?.name} })
        }
        
  },[])


  useEffect(() => {
    socket?.on("callRejected", ({  receiverId }) => {
      toast.info(`${receiverId} rejected the call`);
      handleCallStop();
    });
  
    return () => {
      socket?.off("callRejected");
    };
  }, [socket]); 

 

  useEffect(() => {

    if(!peerConnection.current){
      peerConnection.current = new RTCPeerConnection(servers)
    }

    socket?.on("sendOfferToReceiver", sendOfferToReceiver );
    socket?.on("receivingCallEnded", handleReceivingCallEnded)

    socket?.on("callAccepted", handleCallAccept);
    socket?.on("receiveAnswer", receiveAnswer);
    socket?.on("receiveCandidate", receiveCandidate);


    if (peerConnection.current && !peerConnection.current.ontrack) {
      peerConnection.current.ontrack = (event: any) => {
        
  
        if (remoteVideoRef.current) {
          
            remoteVideoRef.current.srcObject = event.streams[0];

        }
      };
    }

    return () => {

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
    }
       socket?.off("sendOfferToReceiver")
       socket?.off("receivingCallEnded")

       socket?.off("callAccepted");
       socket?.off("receiveAnswer");
       socket?.off("receiveCandidate")
    }
     
  },[socket]);

  const handleCallStop = () => {
    if(peerConnection.current){
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if(localStream){
      localStream.current?.getTracks().forEach((track) => {
        track.stop();
      });
      localStream.current = undefined;
    }

    socket?.emit("callEnded", {to:providerId});

    toast.info("call ended")
     setTimeout(() => {
      navigate(-1);
    }, 2000);
  }

  const handleReceivingCallEnded = () => {
     toast.info("the provider is ended the call");
     if(peerConnection.current){
      peerConnection.current.close();
      peerConnection.current = null
     }
     if(localStream.current){
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = undefined;
     }
     setCallingState("callEnded");
     navigate(-1)
  }

  const receiveCandidate = async(response:any) => {
        console.log("This is receiveCandidate: ", response.event)
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(response.event))
  }

  const receiveAnswer = (response:any) => {
     if(peerConnection.current){
       peerConnection.current.setRemoteDescription(response.answer);
     }
     setCallingState("connected");
    

  }

  const sendOfferToReceiver = async(response:any) => {
       
      try {
        const offer = new RTCSessionDescription(response.offer);
        await peerConnection.current?.setRemoteDescription(offer);
        
        navigator.mediaDevices
        .getUserMedia({video:true, audio:true})
        .then((stream) => {
          localStream.current = stream
 
          if(videoRef.current){
            videoRef.current.srcObject = stream
          }
 
          stream.getTracks().forEach((track) => {
             peerConnection.current?.addTrack(track, stream)
          })
 
          peerConnection.current
          ?.createAnswer()
          .then(async(answer) => {
            await peerConnection.current?.setLocalDescription(answer);
           // toast.success("answer is emitted")
            socket?.emit("answer", {to:providerId, answer})
          })
          .catch((error) => {
           console.log("Error in creating SDP answer: ", error);
          })
 
        })
        .catch((error) => {
          console.log("Error in aquiring media stream: ", error);
          
        })
 
        if(peerConnection.current){
          peerConnection.current.onicecandidate = (event) => {
             if(event.candidate){
               console.log("This is the candidate: ", event.candidate);
             //  toast.success("sended the candidate key");
               socket?.emit("sendCandidate", {
                 event:event.candidate, 
                 id:providerId,
                 sender:"user"
               })
               
             }else {
               console.log("Callee: All ICE candidates sent.");
             }
          }
        }
        
      } catch (error) {
        console.error("Error during offer handling:", error);
        
      }


  }

  const handleCallAccept = async () => {
    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
  
    
      localStream.current = stream;
  
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
  
      
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });
  
       const offer = await peerConnection.current?.createOffer();
      if (offer) {
        
        socket?.emit("sendOffer", {
          receiverId: providerId,
          offer,
          callerId: userInfo?.id,
        });
  
        
        await peerConnection.current?.setLocalDescription(offer);


      }
  
      
     if (peerConnection.current) {
        peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate:", event.candidate);
          socket?.emit("sendCandidate", {
            event: event.candidate,
            id: providerId,
            sender: "user",
          });
        } else {
          console.log("All ICE candidates sent.");
        }
      };
     }

    } catch (error) {
      // Log errors with context
      console.error("Error during call setup:", error);
    }
  };
  

  return (
    <div className="w-full h-screen bg-black relative flex justify-center items-center">
    {/* Provider's Video (80% Viewport Centered) */}
    <div className="w-[80%] h-[80%] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-gray-800"
      />
      {!remoteVideoRef.current && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900 text-white text-lg">
          Waiting for provider’s video...
        </div>
      )}
    </div>
  
    {/* User's Video (Bottom-Right Corner) */}
    <div className="absolute bottom-6 right-6 w-[120px] h-[120px] md:w-[150px] md:h-[150px] bg-gray-700 rounded-lg overflow-hidden shadow-lg border-2 border-gray-500">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full bg-gray-800"
      />
      {!videoRef.current && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white text-sm">
          Your video is off
        </div>
      )}
    </div>
  
    {/* End Call Button */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
      <button
        aria-label="End Call"
        className="w-[70px] h-[70px] bg-red-500 rounded-full flex justify-center items-center hover:bg-red-600 transition duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
        onClick={handleCallStop}
      >
        <MdCallEnd className="text-3xl text-white" />
      </button>
    </div>
  </div>
  
  );
};

export default VideoCallUI;
