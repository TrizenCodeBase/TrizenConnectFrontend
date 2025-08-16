import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";
import { config } from "../config/environment.js";

const ManagePublishedBlogCard = ({ blog }) => {

    let { banner, blog_id, title, publishedAt, activity } = blog;
    let { userAuth: { access_token } } = useContext(UserContext);

    let [showStat, setShowStat] = useState(false);

    return (
        <div className="border-b border-grey/20 pb-8 mb-8">
            <div className="flex gap-6 items-start">
                {/* Blog Banner */}
                <div className="hidden sm:block flex-shrink-0">
                    <img 
                        src={banner} 
                        className="w-20 h-20 bg-grey object-cover rounded-lg" 
                        alt={title}
                    />
                </div>

                {/* Blog Content */}
                <div className="flex-1 min-w-0">
                    <div className="mb-4">
                        <Link 
                            to={`/blog/${blog_id}`} 
                            className="block text-xl font-bold text-black hover:text-dark-grey transition-colors duration-200 line-clamp-2 mb-2"
                        >
                            {title}
                        </Link>
                        <p className="text-sm text-dark-grey">
                            Published on {getDay(publishedAt)}
                        </p>
                    </div>

                    {/* Action Buttons - Medium Style */}
                    <div className="flex flex-wrap gap-3">
                        <Link 
                            to={`/blog/${blog_id}`} 
                            className="inline-flex items-center gap-2 px-4 py-2 text-dark-grey hover:text-black transition-colors duration-200"
                        >
                            <i className="fi fi-rr-eye text-sm"></i>
                            View
                        </Link>

                        <Link 
                            to={`/editor/${blog_id}`} 
                            className="inline-flex items-center gap-2 px-4 py-2 text-dark-grey hover:text-black transition-colors duration-200"
                        >
                            <i className="fi fi-rr-edit text-sm"></i>
                            Edit
                        </Link>

                        <button 
                            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-dark-grey hover:text-black transition-colors duration-200" 
                            onClick={() => setShowStat(preVal => !preVal)}
                        >
                            <i className="fi fi-rr-stats text-sm"></i>
                            {showStat ? 'Hide Stats' : 'Stats'}
                        </button>

                        <button 
                            className="inline-flex items-center gap-2 px-4 py-2 text-red hover:text-red/80 transition-colors duration-200" 
                            onClick={(e) => deleteBlog(blog, access_token, e.target)}
                        >
                            <i className="fi fi-rr-trash text-sm"></i>
                            Delete
                        </button>
                    </div>
                </div>

                {/* Desktop Stats */}
                <div className="hidden lg:block flex-shrink-0">
                    <BlogStats stats={activity} />
                </div>
            </div>

            {/* Mobile Stats */}
            {showStat && (
                <div className="lg:hidden mt-6 pt-6 border-t border-grey/20">
                    <BlogStats stats={activity} />
                </div>
            )}
        </div>
    )
}

const BlogStats = ({ stats }) => {
    return (
        <div className="text-right">
            <div className="space-y-2">
                {Object.keys(stats)
                    .filter(key => key !== "total_parent_comments" && !key.includes("parent"))
                    .map((key, i) => (
                        <div key={i} className="text-sm">
                            <div className="font-medium text-black">
                                {stats[key].toLocaleString()}
                            </div>
                            <div className="text-dark-grey capitalize">
                                {key.split("_")[1]}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const deleteBlog = (blog, access_token, target) => {

    let { index, blog_id, setStateFunc } = blog;

    target.setAttribute("disabled", true);

    axios.post(config.serverDomain + "/delete-blog", { blog_id }, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    .then(({ data }) => {

        target.removeAttribute("disabled");

        setStateFunc(preVal => {

            let { deletedDocCount = 0 } = preVal;

            preVal.results.splice(index, 1);

            if(!preVal.results.length && preVal.totalDocs - 1 > 0){
                return null;
            }

            if(!deletedDocCount){
                preVal.deletedDocCount = 0;
            }

            preVal.deletedDocCount++;
            preVal.totalDocs--;

            return { ...preVal }
        })

        toast.success("Deleted 👍")

    })
    .catch(err => {
        console.log(err);
        target.removeAttribute("disabled");
    })

}

export default ManagePublishedBlogCard;
