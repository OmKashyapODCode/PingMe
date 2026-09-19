import { useEffect } from "react";
import { Link } from "react-router";
import { BellIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import useUnreadMessages from "../hooks/useUnreadMessages";
import Avatar from "../components/Avatar";

// This page shows message notifications - who sent you unread messages
// Unread counts are cleared automatically when the user opens a specific chat
const NotificationsPage = () => {
  const { unreadBySender, totalUnread } = useUnreadMessages();

  const senderList = Object.entries(unreadBySender);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          {totalUnread > 0 && (
            <span className="badge badge-primary badge-lg">{totalUnread} new</span>
          )}
        </div>

        {senderList.length === 0 ? (
          // Empty state - no unread messages
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
              <BellIcon className="size-8 opacity-40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No new notifications</h3>
            <p className="text-sm opacity-60">
              When someone sends you a message, it will show up here.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5 text-primary" />
              Unread Messages
              <span className="badge badge-primary ml-2">{totalUnread}</span>
            </h2>

            <div className="space-y-3">
              {senderList.map(([senderId, sender]) => (
                <Link
                  key={senderId}
                  to={`/chat/${senderId}`}
                  className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow block"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar
                          src={sender.profilePic}
                          alt={sender.name}
                          size="lg"
                        />
                        {/* Red dot indicator */}
                        <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-error border-2 border-base-200" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{sender.name}</h3>
                        <p className="text-sm opacity-70">
                          Sent you {sender.count} new {sender.count === 1 ? "message" : "messages"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="badge badge-primary">{sender.count}</span>
                        <span className="btn btn-primary btn-sm rounded-full px-4">View Chat</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-xs opacity-50 text-center pt-2">
              Click on a notification to open the chat
            </p>
          </section>
        )}

        {/* Quick link to friend requests */}
        <div className="divider"></div>
        <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <UserCheckIcon className="size-5 text-primary" />
            <span className="font-medium">Friend Requests</span>
          </div>
          <Link to="/friend-requests" className="btn btn-sm btn-outline">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
