import React, { useState, useRef } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { AiFillAudio } from "react-icons/ai";
import { MdCallEnd } from "react-icons/md";

const VideoCallUI = () => {
  const [isMuted, setIsMuted] = useState(false);
  const remoteVideoRef = useRef(null);

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center ">
      <div className="w-full md:w-[60%] h-full md:h-[520px] bg-gray-900 flex flex-col justify-between rounded-md shadow-lg p-4 animate-jump-in">
        {/* Video and User Info Section */}
        <div className="w-full h-[300px] flex flex-col justify-center items-center mt-4 space-y-4">
          {/* Video Stream */}
          <div className="w-[80%] md:w-[50%] h-[150px] bg-gray-700 rounded-lg overflow-hidden relative shadow-md">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full bg-blue-500"
            />
            {/* Placeholder if video is not active */}
            {!remoteVideoRef.current && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-800 text-white text-sm">
                No video available
              </div>
            )}
          </div>

          {/* Caller Details */}
          <div className="w-[80%] md:w-[30%] text-center space-y-2">
            <h5 className="text-white font-semibold text-lg">
              AJR workshop
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
            >
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
