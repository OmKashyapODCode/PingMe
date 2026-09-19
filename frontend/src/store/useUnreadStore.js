import { create } from "zustand";

export const useUnreadStore = create((set) => ({
  unreadBySender: {},
  
  incrementUnread: (senderId, senderName, senderImage) => {
    set((state) => {
      const existing = state.unreadBySender[senderId] || { name: "", profilePic: "", count: 0 };
      return {
        unreadBySender: {
          ...state.unreadBySender,
          [senderId]: {
            name: senderName || existing.name || "Someone",
            profilePic: senderImage || existing.profilePic || "",
            count: existing.count + 1,
          },
        },
      };
    });
  },
  
  clearUnreadForChannel: (channelId) => {
    set((state) => {
      const updated = { ...state.unreadBySender };
      Object.keys(updated).forEach((senderId) => {
        if (channelId.includes(senderId)) {
          delete updated[senderId];
        }
      });
      return { unreadBySender: updated };
    });
  },
  
  clearAllUnread: () => set({ unreadBySender: {} }),
}));
