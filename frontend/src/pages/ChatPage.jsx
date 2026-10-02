import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useStreamClient } from "../context/StreamClientContext";
import Avatar from "../components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  Attachment
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import { VideoIcon, ArrowLeftIcon } from "lucide-react";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  const chatClient = useStreamClient();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const otherUser = friends.find((f) => f._id === targetUserId);

  useEffect(() => {
    if (!chatClient || !authUser || !targetUserId) return;

    const setupChannel = async () => {
      try {
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = chatClient.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChannel(currChannel);
      } catch (error) {
        console.error("Error setting up channel:", error);
        toast.error("Could not open chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    setupChannel();
  }, [chatClient, authUser, targetUserId]);

  const handleVideoCall = async () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      // Send the simple clickable link directly so the other user can join immediately
      await channel.sendMessage({
        text: callUrl
      });
      navigate(`/call/${channel.id}`);
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  const profilePicMap = {};
  friends.forEach((f) => { profilePicMap[f._id] = { pic: f.profilePic, name: f.fullName }; });
  if (authUser) profilePicMap[authUser._id] = { pic: authUser.profilePic, name: authUser.fullName };

  const CustomAttachment = (props) => {
    // Hide Stream's automatic ugly URL preview card for video call links
    if (props.attachment?.type === "url" || props.attachment?.title_link?.includes("/call/")) {
      return null;
    }
    return <Attachment {...props} />;
  };

  const CustomStreamAvatar = ({ user, size }) => {
    if (user?.id === authUser?._id) return null;

    const info = profilePicMap[user?.id] || {};
    const src = info.pic;
    const name = info.name || user?.name || "User";
    
    return (
      <div className="mt-auto mb-1">
        <Avatar src={src} alt={name} size={size === "lg" ? "md" : "xs"} />
      </div>
    );
  };

  return (
    <div className="h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)] flex flex-col overflow-hidden fixed md:static inset-x-0 bottom-0 top-[64px] z-10 bg-base-100">
      <Chat client={chatClient}>
        <Channel channel={channel} Avatar={CustomStreamAvatar} Attachment={CustomAttachment}>
          <Window>
            <div className="flex items-center justify-between px-4 py-2.5 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <ArrowLeftIcon className="size-4" />
                </button>
                {otherUser && (
                  <>
                    <Avatar src={otherUser.profilePic} alt={otherUser.fullName} size="sm" />
                    <div>
                      <p className="font-semibold text-sm leading-tight text-base-content">{otherUser.fullName}</p>
                      <p className="text-xs opacity-70 text-base-content">
                        {channel.state.watcher_count > 1 ? "Online" : "Offline"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleVideoCall}
                className="btn btn-sm btn-primary gap-2"
                title="Start video call"
              >
                <VideoIcon className="size-4" />
                <span className="hidden sm:inline">Call</span>
              </button>
            </div>

            <MessageList />

            <div className="px-4 py-2 bg-base-100 border-t border-base-300">
              <MessageInput focus />
            </div>
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;



