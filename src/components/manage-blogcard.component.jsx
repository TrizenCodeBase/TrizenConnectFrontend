import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManagePublishedBlogCard = ({ blog }) => {

    let { banner, blog_id, title, publishedAt, activity } = blog;
    let { userAuth: { access_token } } = useContext(UserContext);

    let [showStat, setShowStat] = useState(false);

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">

                <img src={banner} className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">

                    <div>
                        <Link to={`/blog/${blog_id}`} className="blog-title mb-4 hover:underline">{title}</Link>

                        <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">Edit</Link>

                        <button className="lg:hidden pr-4 py-2 underline" onClick={() => setShowStat(preVal => !preVal)}>Stats</button>

                        <button className="pr-4 py-2 underline text-red" 
                            onClick={(e) => deleteBlog(blog, access_token, e.target)}
                        >
                            Delete
                        </button>
                    </div>

                </div>

                <div className="max-lg:hidden">

                    <BlogStats stats={activity} />

                </div>

            </div>

            {
                showStat ? <div className="lg:hidden"><BlogStats stats={activity} /></div> : ""
            }

        </>
    )
}

const BlogStats = ({ stats }) => {
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">

            {
                Object.keys(stats).filter(key => key !== "total_parent_comments").map((key, i) => {
                    return !key.includes("parent") ? <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + ( i == 0 ? " border-grey border-r " : " ")}>

                        <h1 className="text-xl lg:text-2xl mb-2">{stats[key].toLocaleString()}</h1>
                        <p className="max-lg:text-dark-grey capitalize">{key.split("_")[1]}</p>

                    </div> : ""
                })
            }

        </div>
    )
}

const deleteBlog = (blog, access_token, target) => {

    let { index, blog_id, setStateFunc } = blog;

    target.setAttribute("disabled", true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", { blog_id }, {
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
