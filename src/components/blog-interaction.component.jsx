import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { config } from "../config/environment.js";

const BlogInteraction = ({ blog, setBlog, commentsWrapper, setCommentsWrapper }) => {
    let {
        _id,
        title,
        blog_id,
        activity,
        activity: { total_likes, total_comments },
        author: { personal_info: { username: author_username } }
    } = blog;

    let { userAuth: { username, access_token } } = useContext(UserContext);
    const navigate = useNavigate();

    const [isLikedByUser, setLikedByUser] = useState(false);

    useEffect(() => {
        if (access_token) {
            // Check if current user has liked this blog
            axios.post(config.serverDomain + "/isliked-by-user", { _id }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { result } }) => {
                setLikedByUser(result);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, []);

    const handleLike = () => {
        console.log("Like button clicked");
        console.log("Access token:", !!access_token);
        console.log("Current like state:", isLikedByUser);
        console.log("Blog ID:", _id);
        
        if (access_token) {
            // Store current state for potential revert
            const currentLikeState = isLikedByUser;
            const currentLikeCount = total_likes;

            // Optimistic update
            setLikedByUser(!isLikedByUser);
            const newLikeCount = !isLikedByUser ? total_likes + 1 : total_likes - 1;
            
            setBlog(prevBlog => ({ 
                ...prevBlog, 
                activity: { 
                    ...prevBlog.activity, 
                    total_likes: newLikeCount 
                } 
            }));

            console.log("Sending like request:", { _id, isLikedByUser: currentLikeState });
            
            axios.post(config.serverDomain + "/like-blog", {
                _id, 
                isLikedByUser: currentLikeState
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                // Update with server response
                setBlog(prevBlog => ({ 
                    ...prevBlog, 
                    activity: { 
                        ...prevBlog.activity, 
                        total_likes: data.total_likes 
                    } 
                }));
                setLikedByUser(data.liked_by_user);
            })
            .catch(err => {
                console.log("Like error:", err);
                // Revert optimistic update on error
                setLikedByUser(currentLikeState);
                setBlog(prevBlog => ({ 
                    ...prevBlog, 
                    activity: { 
                        ...prevBlog.activity, 
                        total_likes: currentLikeCount 
                    } 
                }));
                toast.error("Failed to update like. Please try again.");
            });

        } else {
            toast.error("Please login to like this blog");
            // Redirect to login after a short delay
            setTimeout(() => navigate("/signin"), 1500);
        }
    };

    return (
        <>
            <hr className="border-grey my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">

                    <button 
                        onClick={handleLike}
                        className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}
                        title={!access_token ? "Login to like this blog" : "Like this blog"}
                    >
                        <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button 
                        onClick={() => {
                            if (!access_token) {
                                toast.error("Please login to view comments");
                                setTimeout(() => navigate("/signin"), 1500);
                            } else {
                                setCommentsWrapper(preVal => !preVal);
                            }
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                        title={!access_token ? "Login to view comments" : "View comments"}
                    >
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>

                </div>

                <div className="flex gap-3 items-center">

                    {!access_token ? 
                        <Link to="/signin" className="btn-light rounded-md px-4 py-2 text-sm">
                            Login to Interact
                        </Link>
                        : ""
                    }

                    {username === author_username ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>

                </div>

            </div>

            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;
