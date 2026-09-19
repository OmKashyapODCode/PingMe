import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import useUnreadMessages from "../hooks/useUnreadMessages";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Avatar from "../components/Avatar";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("friends"); // "friends" or "learners"

  // Get unread messages to sort friends
  const { unreadBySender } = useUnreadMessages();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Sort friends so that those with unread messages appear at the top
  const sortedFriends = useMemo(() => {
    if (!friends) return [];
    return [...friends].sort((a, b) => {
      const countA = unreadBySender[a._id]?.count || 0;
      const countB = unreadBySender[b._id]?.count || 0;
      return countB - countA; // Descending order of unread count
    });
  }, [friends, unreadBySender]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="container mx-auto space-y-6">
        
        {/* TOP BAR: Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 border-b border-base-300 pb-2">
          
          {/* TABS */}
          <div className="tabs tabs-boxed bg-base-200">
            <button
              className={`tab tab-lg font-semibold ${activeTab === "friends" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("friends")}
            >
              Your Friends
            </button>
            <button
              className={`tab tab-lg font-semibold ${activeTab === "learners" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("learners")}
            >
              Meet New Learners
            </button>
          </div>
        </div>

        {/* TAB CONTENT: FRIENDS */}
        {activeTab === "friends" && (
          <section className="animate-fadeIn">
            {loadingFriends ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : sortedFriends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB CONTENT: MEET NEW LEARNERS */}
        {activeTab === "learners" && (
          <section className="animate-fadeIn">
            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                <p className="text-base-content opacity-70">
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.profilePic} alt={user.fullName} size="xl" />

                          <div>
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages with flags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitialize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitialize(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                        {/* Action button */}
                        <button
                          className={`btn w-full mt-2 ${
                            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
