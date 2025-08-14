import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { config } from "../config/environment.js";

const CommentField = ({ blog, setBlog, index = undefined, replyingTo = undefined, setReplying }) => {

    let { 
        _id, 
        author, 
        comments, 
        activity, 
        activity: { total_comments, total_parent_comments } 
    } = blog;
    
    // Extract blog_author ID safely
    let blog_author = author?._id;
    let commentsArr = comments?.results || [];
    
    console.log("Blog author extracted:", blog_author);
    console.log("Full author object:", author);

    let { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);
    const navigate = useNavigate();

    const [comment, setComment] = useState("");

    const handleComment = () => {
        console.log("Comment button clicked");
        console.log("Access token:", !!access_token);
        console.log("Comment content:", comment);
        console.log("Blog data:", { _id, blog_author });

        if (!access_token) {
            toast.error("Please login first to leave a comment");
            // Redirect to login after a short delay
            setTimeout(() => navigate("/signin"), 1500);
            return;
        }

        if (!comment.length) {
            return toast.error("Write something to leave a comment...");
        }

        axios.post(config.serverDomain + "/add-comment", {
            _id, blog_author, comment, replying_to: replyingTo
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {

            setComment("");

            data.commented_by = { personal_info: { username, profile_img, fullname } };

            let newCommentArr;

            if (replyingTo) {
                // Handle reply
                if (commentsArr[index]) {
                    commentsArr[index].children = commentsArr[index].children || [];
                    commentsArr[index].children.push(data._id);
                    data.childrenLevel = (commentsArr[index].childrenLevel || 0) + 1;
                    data.parentIndex = index;
                    commentsArr[index].isReplyLoaded = true;
                    commentsArr.splice(index + 1, 0, data);
                }
                newCommentArr = [...commentsArr];
                if (setReplying) setReplying(false);
            } else {
                // Handle new comment
                data.childrenLevel = 0;
                newCommentArr = [data, ...commentsArr];
            }

            let parentCommentIncrementVal = replyingTo ? 0 : 1;

            setBlog({
                ...blog, 
                comments: { 
                    ...comments, 
                    results: newCommentArr 
                },
                activity: {
                    ...activity,
                    total_comments: total_comments + 1,
                    total_parent_comments: total_parent_comments + parentCommentIncrementVal
                }
            });

        })
        .catch(err => {
            console.log(err);
            toast.error(err.response?.data?.error || "Something went wrong");
        });

    };

    return (
        <>
            <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
            ></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                {replyingTo ? "Reply" : "Comment"}
            </button>
        </>
    );

};

export default CommentField;
