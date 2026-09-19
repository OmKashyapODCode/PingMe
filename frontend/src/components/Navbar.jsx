import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import Avatar from "./Avatar";
import useUnreadMessages from "../hooks/useUnreadMessages";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  // Unread message count from Stream Chat
  const { totalUnread } = useUnreadMessages();

  // Pending friend request count from our backend
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  const pendingReqCount = friendRequests?.incomingReqs?.length || 0;

  // Total badge = unread messages + pending friend requests
  const totalBadge = totalUnread + pendingReqCount;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  PingMe
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Bell icon - badge shows pending friend requests + unread messages */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {/* Red badge visible when there are any notifications */}
                {totalBadge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-error text-white text-xs font-bold flex items-center justify-center px-1">
                    {totalBadge > 99 ? "99+" : totalBadge}
                  </span>
                )}
              </button>
            </Link>
          </div>

          <ThemeSelector />

          {/* Profile avatar - click to edit profile */}
          <Link to="/profile" className="mx-2" title="Edit Profile">
            <Avatar src={authUser?.profilePic} alt={authUser?.fullName} size="sm" />
          </Link>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
