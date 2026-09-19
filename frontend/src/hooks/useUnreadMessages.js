import { useEffect, useState, useCallback } from "react";
import useAuthUser from "./useAuthUser";
import { useLocation } from "react-router";
import { useStreamClient } from "../context/StreamClientContext";

// This hook listens to incoming messages via Stream Chat
// and tracks how many unread messages each sender has sent
// while the user is NOT in that specific chat window.
const useUnreadMessages = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const chatClient = useStreamClient();

  // Object: senderId -> { name, profilePic, count }
  const [unreadBySender, setUnreadBySender] = useState({});

  useEffect(() => {
    // Wait until chatClient is available from context
    if (!authUser || !chatClient) return;

    // Called every time a new message is received in any channel
    const handleNewMessage = (event) => {
      const msg = event.message;

      // Skip messages sent by current user
      if (msg.user?.id === authUser._id) return;

      const senderId = msg.user?.id;

      // If user is currently in the chat with this sender, skip counting
      if (
        location.pathname.startsWith("/chat/") &&
        location.pathname.includes(senderId)
      ) {
        return;
      }

      // Increment unread count for this sender
      setUnreadBySender((prev) => {
        const existing = prev[senderId] || { name: "", profilePic: "", count: 0 };
        return {
          ...prev,
          [senderId]: {
            name: msg.user?.name || "Someone",
            profilePic: msg.user?.image || "",
            count: existing.count + 1,
          },
        };
      });
    };

    chatClient.on("message.new", handleNewMessage);

    return () => {
      // Remove the event listener when component unmounts or deps change
      if (chatClient) {
        chatClient.off("message.new", handleNewMessage);
      }
    };
  }, [authUser, chatClient, location.pathname]);

  // When user enters a chat page, clear unread for that sender
  useEffect(() => {
    if (location.pathname.startsWith("/chat/")) {
      // channelId format: userId1-userId2 (sorted alphabetically)
      const channelId = location.pathname.replace("/chat/", "");

      setUnreadBySender((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((senderId) => {
          if (channelId.includes(senderId)) {
            delete updated[senderId];
          }
        });
        return updated;
      });
    }
  }, [location.pathname]);

  // Total count across all senders
  const totalUnread = Object.values(unreadBySender).reduce(
    (sum, sender) => sum + sender.count,
    0
  );

  // Call this to clear all unread (e.g. when user opens the Notifications page)
  const clearAllUnread = useCallback(() => {
    setUnreadBySender({});
  }, []);

  return { unreadBySender, totalUnread, clearAllUnread };
};

export default useUnreadMessages;
