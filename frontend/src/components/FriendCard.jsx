import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import Avatar from "./Avatar";
import { MessageSquareIcon } from "lucide-react";
import useUnreadMessages from "../hooks/useUnreadMessages";

const FriendCard = ({ friend }) => {
  const { unreadBySender } = useUnreadMessages();
  const unreadCount = unreadBySender[friend._id]?.count || 0;

  return (
    <Link to={`/chat/${friend._id}`} className="block group">
      <div className="card bg-base-200 hover:bg-base-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-base-300 hover:border-primary/30">
        <div className="card-body p-4">
          {/* USER INFO */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Avatar src={friend.profilePic} alt={friend.fullName} size="md" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-sm">{friend.fullName}</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-error font-medium">{unreadCount} new message{unreadCount > 1 ? "s" : ""}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="badge badge-secondary badge-sm">
              {getLanguageFlag(friend.nativeLanguage)}
              {friend.nativeLanguage}
            </span>
            <span className="badge badge-outline badge-sm">
              {getLanguageFlag(friend.learningLanguage)}
              {friend.learningLanguage}
            </span>
          </div>

          <div className="btn btn-primary btn-sm w-full gap-2 group-hover:btn-primary">
            <MessageSquareIcon className="size-3.5" />
            {unreadCount > 0 ? `View ${unreadCount} New` : "Message"}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
