import { useUnreadStore } from "../store/useUnreadStore";

// This hook now just reads from the global Zustand store
// The actual listening happens in StreamClientContext to ensure it only runs once
const useUnreadMessages = () => {
  const unreadBySender = useUnreadStore((state) => state.unreadBySender);
  const clearAllUnread = useUnreadStore((state) => state.clearAllUnread);

  // Total count across all senders
  const totalUnread = Object.values(unreadBySender).reduce(
    (sum, sender) => sum + sender.count,
    0
  );

  return { unreadBySender, totalUnread, clearAllUnread };
};

export default useUnreadMessages;
