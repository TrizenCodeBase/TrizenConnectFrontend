import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { config } from "../config/environment.js";

const FollowButton = ({ authorId, authorUsername }) => {
    let { userAuth: { username, access_token } } = useContext(UserContext);
    const navigate = useNavigate();

    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showUnfollow, setShowUnfollow] = useState(false);

    useEffect(() => {
        if (access_token && authorId) {
            console.log("Checking follow status for:", { authorId, authorUsername });
            // Check if current user is following this author
            axios.post(config.serverDomain + "/is-following", { 
                user_id: authorId 
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { result } }) => {
                console.log("Follow status check result:", { authorUsername, isFollowing: result });
                setIsFollowing(result);
            })
            .catch(err => {
                console.log("Error checking follow status:", err);
            });
        } else {
            console.log("Not checking follow status:", { access_token: !!access_token, authorId });
        }
    }, [access_token, authorId]);

    const handleFollow = () => {
        console.log("Follow button clicked");
        console.log("Access token:", !!access_token);
        console.log("Author ID:", authorId);
        console.log("Current following state:", isFollowing);

        if (!access_token) {
            toast.error("Please login to follow users");
            setTimeout(() => navigate("/signin"), 1500);
            return;
        }

        if (username === authorUsername) {
            toast.error("You cannot follow yourself");
            return;
        }

        setIsLoading(true);

        // Optimistic update
        setIsFollowing(!isFollowing);

        axios.post(config.serverDomain + "/follow-user", {
            user_id: authorId,
            isFollowing: isFollowing
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            setIsFollowing(data.following);
            toast.success(data.message);
        })
        .catch(err => {
            console.log("Follow error:", err);
            // Revert optimistic update
            setIsFollowing(isFollowing);
            toast.error(err.response?.data?.error || "Failed to follow/unfollow user");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Don't show follow button if user is viewing their own profile
    if (username === authorUsername) {
        return null;
    }

    return (
        <button 
            onClick={handleFollow}
            disabled={isLoading}
            className={
                "ml-4 px-4 py-1 border rounded-full text-lg md:text-xl font-medium transition-all duration-200 relative " +
                (isFollowing 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-red-600 hover:border-red-600" 
                    : "border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                ) +
                (isLoading ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
            }
            title={!access_token ? "Login to follow this user" : (isFollowing ? `Click to unfollow ${authorUsername}` : `Click to follow ${authorUsername}`)}
            onMouseEnter={() => {
                if (isFollowing && !isLoading) {
                    setShowUnfollow(true);
                }
            }}
            onMouseLeave={() => {
                if (isFollowing && !isLoading) {
                    setShowUnfollow(false);
                }
            }}
        >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        {isFollowing ? "Unfollowing..." : "Following..."}
                    </span>
                ) : (
                    <>
                        {isFollowing ? (
                            <span className="flex items-center gap-1">
                                {showUnfollow ? (
                                    <>
                                        <i className="fi fi-rr-cross text-sm"></i>
                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <i className="fi fi-sr-check text-sm"></i>
                                        Following
                                    </>
                                )}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <i className="fi fi-rr-plus text-sm"></i>
                                Follow
                            </span>
                        )}
                    </>
                )}
        </button>
    );
};

export default FollowButton;
