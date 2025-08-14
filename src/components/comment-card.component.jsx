import { useContext, useState } from "react";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { config } from "../config/environment.js";
import { getDay } from "../common/date";
import CommentField from "./comment-field.component";

const CommentCard = ({ index, leftVal, commentData, blog, setBlog }) => {

    let { commented_by: { personal_info: { profile_img, fullname, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData;

    let { userAuth: { access_token, username } } = useContext(UserContext);

    const [isReplying, setReplying] = useState(false);

    const getParentIndex = () => {
        let startingPoint = index - 1;

        try {
            while (blog.comments.results[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }
        } catch {
            startingPoint = undefined;
        }

        return startingPoint;
    };

    const removeCommentsCards = (startingPoint, isDelete = false) => {

        if (blog.comments.results[startingPoint]) {
            while (blog.comments.results[startingPoint].childrenLevel > commentData.childrenLevel) {
                blog.comments.results.splice(startingPoint, 1);

                if (!blog.comments.results[startingPoint]) {
                    break;
                }
            }
        }

        if (isDelete) {
            let parentIndex = getParentIndex();

            if (parentIndex != undefined) {
                blog.comments.results[parentIndex].children = blog.comments.results[parentIndex].children.filter(child => child != _id);

                if (!blog.comments.results[parentIndex].children.length) {
                    blog.comments.results[parentIndex].isReplyLoaded = false;
                }
            }

            blog.comments.results.splice(index, 1);
        }

        if (blog.comments.results[startingPoint] && blog.comments.results[startingPoint].childrenLevel != undefined) {
            removeCommentsCards(startingPoint, isDelete);
        }

    };

    const hideReplies = () => {

        commentData.isReplyLoaded = false;

        removeCommentsCards(index + 1);

    };

    const loadReplies = ({ skip = 0, currentIndex = index }) => {

        if (children.length) {

            hideReplies();

            axios.post(config.serverDomain + "/get-replies", { _id, skip })
                .then(({ data: replies }) => {

                    commentData.isReplyLoaded = true;

                    for (let i = 0; i < replies.length; i++) {

                        replies[i].childrenLevel = commentData.childrenLevel + 1;

                        blog.comments.results.splice(currentIndex + 1 + i + skip, 0, replies[i]);

                    }

                    setBlog({ ...blog, comments: { ...blog.comments, results: blog.comments.results } });

                })
                .catch(err => {
                    console.log(err);
                });
        }

    };

    const deleteComment = (e) => {

        e.target.setAttribute("disabled", true);

        axios.post(config.serverDomain + "/delete-comment", { _id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {

            e.target.removeAttribute("disabled");

            removeCommentsCards(index + 1, true);

        })
        .catch(err => {
            console.log(err);
            e.target.removeAttribute("disabled");
        });

    };

    const LoadMoreRepliesButton = () => {

        let parentIndex = getParentIndex();

        let button = <button onClick={() => loadReplies({ skip: index - parentIndex, currentIndex: parentIndex })} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
            <i className="fi fi-rs-comment-dots"></i>
            Load More Replies
        </button>;

        if (blog.comments.results[index + 1]) {

            if (blog.comments.results[index + 1].childrenLevel < commentData.childrenLevel) {

                if ((index - parentIndex) < blog.comments.results[parentIndex].children.length) {
                    return button;
                }

            }

        } else {

            if (parentIndex) {
                if ((index - parentIndex) < blog.comments.results[parentIndex].children.length) {
                    return button;
                }
            }

        }

    };

    return (

        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>

            <div className="my-5 p-6 rounded-md border border-grey">

                <div className="flex gap-3 items-center mb-8">

                    <img src={profile_img} className="w-6 h-6 rounded-full" />

                    <p className="line-clamp-1">{fullname} @{commented_by_username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>

                </div>

                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">

                    {
                        commentData.isReplyLoaded ? 

                            <button 
                                className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                                onClick={hideReplies}
                            >
                                <i className="fi fi-rs-comment-dots"></i>
                                Hide Reply
                            </button>

                            :

                            <button 
                                className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                                onClick={loadReplies}
                            >
                                <i className="fi fi-rs-comment-dots"></i>
                                {children.length} Reply
                            </button>
                    }

                    <button className="underline" onClick={() => setReplying(preVal => !preVal)}>Reply</button>

                    {
                        username == commented_by_username || username == blog.author.personal_info.username ? 

                            <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComment}>
                                <i className="fi fi-rr-trash pointer-events-none"></i>
                            </button> : ""
                    }

                </div>

                {
                    isReplying ? 

                        <div className="mt-8">
                            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} blog={blog} setBlog={setBlog} />
                        </div> : ""
                }

            </div>

            <LoadMoreRepliesButton />

        </div>

    );

};

export default CommentCard;
