import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const StreamClientContext = createContext(null);

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Helper: base64 strings are too large for Stream WebSocket URL - skip them
const getSafeImageUrl = (pic) => {
  if (!pic) return "";
  if (pic.startsWith("data:")) return ""; // base64 - skip
  return pic; // real URL - safe to use
};

export const StreamClientProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const [streamClient, setStreamClient] = useState(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!authUser || !tokenData?.token || !STREAM_API_KEY) return;

    const connect = async () => {
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              // IMPORTANT: never send base64 to Stream - WebSocket URL will be too large
              image: getSafeImageUrl(authUser.profilePic),
            },
            tokenData.token
          );
          console.log("Stream connected for:", authUser.fullName);
        }

        setStreamClient(client);
      } catch (error) {
        console.error("Stream connection failed:", error.message);
      }
    };

    connect();

    return () => {
      // Disconnect on logout
      const client = StreamChat.getInstance(STREAM_API_KEY);
      if (client.userID) {
        client.disconnectUser().catch(console.error);
        setStreamClient(null);
      }
    };
  }, [authUser, tokenData]);

  return (
    <StreamClientContext.Provider value={streamClient}>
      {children}
    </StreamClientContext.Provider>
  );
};

// Use this in any component to get the shared Stream client
export const useStreamClient = () => useContext(StreamClientContext);
