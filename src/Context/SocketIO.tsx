import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { URL } from "../utils/api";

interface ISocketContext {
    socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({ socket: null });


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    
    const { userInfo } = useSelector((state: RootState) => state.user);
    const { providerInfo } = useSelector((state: RootState) => state.provider);
    const loggedUser = userInfo !== null ? userInfo?.id : providerInfo?.id;

    useEffect(() => {
        if (loggedUser) {
            
            const newSocket = io( URL , {
                query: {
                    userId: loggedUser,
                },
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket);
            });

            setSocket(newSocket);

            
            return () => {
                console.log("Socket disconnected:", newSocket);
                newSocket.disconnect();
            };
        } else {
            
            setSocket(null);
        }
    }, [loggedUser]); 

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
