import  { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../../redux/store';
import { useSocket } from '../../Context/SocketIO';
import { MdCallEnd } from 'react-icons/md';
import { toast } from 'sonner';
//import { CallingState } from '../../interface/provider/iProvider';

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


function ProviderCall() {

    const location = useLocation();
    const {providerInfo} = useSelector((state:RootState) => state.provider);
    const {userId} = useParams();
    const {socket} = useSocket();
    const providerSideVideoRef = useRef<HTMLVideoElement | null>(null)
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
   // const [callingState, setCallingState] = useState<CallingState>("trying To connect");
    const localStrem = useRef<MediaStream | undefined | null>();
    const navigate = useNavigate();



    useEffect(() => {
      if(!location.state){
       // toast.success("createRoom for call")
        socket?.emit("createRoomForCall", {providerId:providerInfo?.id, userId , caller:"provider"});
        
      }
    },[]);

    useEffect(() => {
      if(!peerConnection.current){
        peerConnection.current = new RTCPeerConnection(servers)
      }
      socket?.on("receiveAnswer", receiveAnswer);
      socket?.on("receivingCallEnded", handleReceivingCallEnded)

      socket?.on("callAccepted", handleCallAccept )
      socket?.on("sendOfferToReceiver", sendOfferToReceiver);
      socket?.on("receiveCandidate", receiveCandidate );

      peerConnection.current.ontrack = (event) => {
        ///console.log("event vannu",event.streams[0]);
        
        const remoteStream = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };
      if (peerConnection.current) {
        peerConnection.current.oniceconnectionstatechange = () => {
          console.log(peerConnection.current?.iceConnectionState);
        };
      }

      return () => {
         if(peerConnection.current){
           peerConnection.current.close();
           peerConnection.current = null
         }

         socket?.off("sendOfferToReceiver");
         socket?.off("receiveCandidate");
         socket?.off("callAccepted");
         socket?.off("receiveAnswer");
         socket?.off("receivingCallEnded")
      }
    },[socket]);

    const receiveCandidate = async(response:any) => {
      // toast.success("Receivde candidate");
       await peerConnection.current?.addIceCandidate(new RTCIceCandidate(response.event))
       console.log("Thsi si the received canddate: ", response.event);
       
      // toast.success("connected");
    }

    const receiveAnswer = (response:any) => {
       // toast.success("anser is received")
        if(peerConnection.current){
           peerConnection.current.setRemoteDescription(response.answer)
        }
     //   setCallingState("connected");
        
    }

    const handleReceivingCallEnded = () => {
      toast.info("the user is ended the call");
      if(peerConnection.current){
       peerConnection.current.close();
       peerConnection.current = null
      }
      if(localStrem.current){
       localStrem.current.getTracks().forEach((track) => track.stop());
       localStrem.current = undefined;
      }
    //  setCallingState("callEnded");
      navigate(-1)
   }

    const handleCallAccept = async () => {
         try {

          const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
          });

          localStrem.current = stream;

          if(providerSideVideoRef.current){
             providerSideVideoRef.current.srcObject = stream
          }

          stream.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, stream)
          })

          const offer = await peerConnection.current?.createOffer();

          if(offer){
              
              socket?.emit("sendOffer", {
                receiverId:userId,
                offer,
                callerId:providerInfo?.id
              })

              await peerConnection.current?.setLocalDescription(offer)
          }
          
         } catch (error) {
           console.log("Error in handleCallAccept: ", error);
          
         }
    }


    const sendOfferToReceiver = async (response: any) => {
      try {
        const offer = new RTCSessionDescription(response.offer);
        await peerConnection.current?.setRemoteDescription(offer);
        console.log("Remote description set successfully.");
    
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            console.log("Callee: Local media stream obtained:", stream);
            localStrem.current = stream;
          
            if (providerSideVideoRef.current) {
              providerSideVideoRef.current.srcObject = stream;
            }
    
            stream.getTracks().forEach((track) => {
              peerConnection.current?.addTrack(track, stream);
            });
          
            peerConnection.current
              ?.createAnswer()
              .then(async (answer) => {
                await peerConnection.current?.setLocalDescription(answer);
                socket?.emit("answer", { to: userId, answer });
              })
              .catch((error) => {
                console.error("Error creating SDP answer:", error);
              });
          })
          .catch((error) => {
            console.error("Error acquiring media stream:", error);
          });
    
        if (peerConnection.current) {
          // Handle ICE candidates
          peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
              console.log("Callee: Sending ICE candidate:", event.candidate);
              socket?.emit("sendCandidate", {
                event: event.candidate,
                id: userId,
                sender: "provider",
              });
            } else {
              console.log("Callee: All ICE candidates sent.");
            }
          };
    
         // Handle remote tracks
         // console.log("ivde vare vannu");
          
          // peerConnection.current.ontrack = (event) => {
          //   console.log("Callee: Remote track received:", event.streams[0]);
          //   if (remoteVideoRef.current) {
          //     remoteVideoRef.current.srcObject = event.streams[0];
          //   }
          // };
        }
      } catch (error) {
        console.error("Error during offer handling:", error);
      }
    };
    

  const handleCallStop = () => {
     if(peerConnection.current){
        peerConnection.current.close();
        peerConnection.current = null;
     }

     if (localStrem.current) {
      localStrem.current.getTracks().forEach((track) => {
        track.stop(); 
      });
      localStrem.current = undefined; 
    }

    socket?.emit("callEnded", {to:userId})

     toast.info("call ended")
     setTimeout(() => {
      navigate(-1);
    }, 2000);
  }


  return (
    <>
       <div className="w-full h-screen bg-black relative flex justify-center items-center">
  {/* Main Video */}
  <div className="w-[80%] h-[80%] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover bg-gray-800"
    />
  </div>

  {/* Provider Preview */}
  <div className="absolute bottom-6 right-6 w-[120px] h-[120px] md:w-[150px] md:h-[150px] bg-gray-700 rounded-lg overflow-hidden shadow-lg border-2 border-gray-500">
    <video
      ref={providerSideVideoRef}
      autoPlay
      playsInline
      className="w-full h-full bg-gray-800"
    />
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

    </>
  )
}

export default ProviderCall
