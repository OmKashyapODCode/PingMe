import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, PencilIcon, ShipWheelIcon, UsersIcon } from "lucide-react";
import Avatar from "./Avatar";
import useUnreadMessages from "../hooks/useUnreadMessages";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  // Get unread message count for Notifications badge
  const { totalUnread } = useUnreadMessages();

  // Get pending friend requests count for Friend Requests badge
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  // Count only the incoming pending requests
  const pendingReqCount = friendRequests?.incomingReqs?.length || 0;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* APP LOGO */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            PingMe
          </span>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Home */}
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        {/* Friend Requests link - shows red badge when there are pending requests */}
        <Link
          to="/friend-requests"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friend-requests" ? "btn-active" : ""
          }`}
        >
          <div className="relative">
            <UsersIcon className="size-5 text-base-content opacity-70" />
            {/* Red dot badge when there are pending friend requests */}
            {pendingReqCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                {pendingReqCount > 9 ? "9+" : pendingReqCount}
              </span>
            )}
          </div>
          <span>Friend Requests</span>
          {/* Count badge on the right side */}
          {pendingReqCount > 0 && (
            <span className="badge badge-error badge-sm ml-auto">{pendingReqCount}</span>
          )}
        </Link>

        {/* Notifications - message notifications with badge */}
        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <div className="relative">
            <BellIcon className="size-5 text-base-content opacity-70" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </div>
          <span>Notifications</span>
          {totalUnread > 0 && (
            <span className="badge badge-error badge-sm ml-auto">{totalUnread}</span>
          )}
        </Link>
      </nav>

      {/* USER PROFILE SECTION - click to edit profile */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
          <Avatar src={authUser?.profilePic} alt={authUser?.fullName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
          {/* Edit icon shown on hover */}
          <PencilIcon className="size-4 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
