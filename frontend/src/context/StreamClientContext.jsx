import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { useUnreadStore } from "../store/useUnreadStore";
import { useLocation } from "react-router";

const StreamClientContext = createContext(null);

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const getSafeImageUrl = (pic) => {
  if (!pic) return "";
  if (pic.startsWith("data:")) return ""; 
  return pic; 
};

export const StreamClientProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const [streamClient, setStreamClient] = useState(null);
  
  // Zustand store actions
  const incrementUnread = useUnreadStore((state) => state.incrementUnread);
  const clearUnreadForChannel = useUnreadStore((state) => state.clearUnreadForChannel);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Handle clearing unread when entering a chat
  useEffect(() => {
    if (location.pathname.startsWith("/chat/")) {
      const channelId = location.pathname.replace("/chat/", "");
      clearUnreadForChannel(channelId);
    }
  }, [location.pathname, clearUnreadForChannel]);

  useEffect(() => {
    if (!authUser || !tokenData?.token || !STREAM_API_KEY) return;

    let client;
    let handleNewMessage;

    const connect = async () => {
      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: getSafeImageUrl(authUser.profilePic),
            },
            tokenData.token
          );
        }
        
        // Sync exact unread counts from Stream Chat Server
        const filter = { type: "messaging", members: { $in: [authUser._id] } };
        const sort = { last_message_at: -1 };
        const channels = await client.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        channels.forEach((channel) => {
          const unreadCount = channel.countUnread();
          if (unreadCount > 0) {
            // Find the other user in the channel
            const otherMember = Object.values(channel.state.members).find(
              (m) => m.user.id !== authUser._id
            );
            if (otherMember) {
              const u = otherMember.user;
              useUnreadStore.getState().setUnreadData(u.id, u.name, u.image, unreadCount);
            }
          }
        });
        
        // Listen for new messages globally here
        handleNewMessage = (event) => {
          const msg = event.message;
          if (msg.user?.id === authUser._id) return; // Skip own messages

          const senderId = msg.user?.id;
          
          // If already in that specific chat, don't increment
          if (window.location.pathname.startsWith("/chat/") && window.location.pathname.includes(senderId)) {
            return;
          }
          
          incrementUnread(senderId, msg.user?.name, msg.user?.image);
        };
        
        client.on("message.new", handleNewMessage);
        
        // Also listen for mark read events (e.g. from another tab or device)
        client.on("notification.mark_read", (event) => {
           if (event.channel) {
             const channelId = event.channel.id;
             clearUnreadForChannel(channelId);
           }
        });

        setStreamClient(client);
      } catch (error) {
        console.error("Stream connection failed:", error.message);
      }
    };

    connect();

    return () => {
      if (client && handleNewMessage) {
        client.off("message.new", handleNewMessage);
      }
      if (client && client.userID) {
        client.disconnectUser().catch(console.error);
        setStreamClient(null);
      }
    };
  }, [authUser, tokenData, incrementUnread]);

  return (
    <StreamClientContext.Provider value={streamClient}>
      {children}
    </StreamClientContext.Provider>
  );
};

export const useStreamClient = () => useContext(StreamClientContext);
