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
    <div className="w-full h-screen bg-black flex justify-center items-center ">
      <div className="w-full md:w-[60%] h-full md:h-[520px] bg-gray-900 flex flex-col justify-between rounded-md shadow-lg p-4 animate-jump-in">
        {/* Video and User Info Section */}
        <div className="w-full h-[300px] flex flex-col justify-center items-center mt-4 space-y-4">
          {/* Video Stream */}
          <div className="w-[80%] md:w-[50%] h-[150px] bg-gray-700 rounded-lg overflow-hidden relative shadow-md">
            <h1>{callingState}</h1>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full bg-blue-500"
            />
            {/* Placeholder if video is not active */}
            {/* {!videoRef.current && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white text-sm">
                No video available
              </div>
            )} */}
          </div>
          <div className="w-[80%] md:w-[50%] h-[150px] bg-gray-700 rounded-lg overflow-hidden relative shadow-md">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full bg-blue-500"
            />
            {/* Placeholder if video is not active */}
            {/* {!videoRef.current && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white text-sm">
                No video available
              </div>
            )} */}

          </div>

          {/* Caller Details */}
          <div className="w-[80%] md:w-[30%] text-center space-y-2">
            <h5 className="text-white font-semibold text-lg">
              Ajr Workshop-
            </h5>
            <h5 className="text-gray-400 animate-pulse flex justify-center gap-2 font-semibold">
              Calling...
            </h5>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="w-full h-[100px] flex justify-center items-center">
          <div className="w-[80%] md:w-[50%] h-[100px] flex justify-center items-center">
            {/* Mute Button */}
            {/* <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="w-[60px] h-[60px] bg-gray-600 rounded-full flex justify-center items-center hover:bg-gray-500 transition duration-300"
            >
              {isMuted ? (
                <BsFillMicMuteFill className="text-xl text-white" />
              ) : (
                <BsFillMicFill className="text-xl text-white" />
              )}
            </button> */}

            {/* End Call Button */}
            <button
              aria-label="End Call"
              className="w-[60px] h-[60px] shadow-lg bg-red-500 rounded-full flex justify-center items-center hover:shadow-[0_10px_20px_rgba(255,0,0,0.7)] transition-transform duration-300 transform hover:scale-110"
              onClick={handleCallStop}>
              <MdCallEnd className="text-2xl text-white" />
            </button>

            {/* Speaker Button */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallUI;
