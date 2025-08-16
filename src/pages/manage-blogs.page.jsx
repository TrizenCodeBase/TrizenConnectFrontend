import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import ManagePublishedBlogCard from "../components/manage-blogcard.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { config } from "../config/environment.js";

const ManageBlogs = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("published");

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(config.serverDomain + "/user-written-blogs", {
            page, draft, query, deletedDocCount
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(async ({ data }) => {
            let formatedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data: data.blogs,
                page,
                user: access_token,
                countRoute: "/user-written-blogs-count",
                data_to_send: { draft, query }
            })

            if(draft){
                setDrafts(formatedData);
            } else {
                setBlogs(formatedData);
            }
        })
        .catch(err => {
            console.log(err);
            // Set empty results if the request fails
            if(draft){
                setDrafts({results: [], page: 1, totalDocs: 0});
            } else {
                setBlogs({results: [], page: 1, totalDocs: 0});
            }
        })
    }

    useEffect(() => {
        if(access_token){
            if(blogs == null){
                getBlogs({ page: 1, draft: false })
            }
            if(drafts == null){
                getBlogs({ page: 1, draft: true })
            }
        }
    }, [access_token, blogs, drafts, query]);

    const handleSearch = (e) => {
        let searchQuery = e.target.value;
        setQuery(searchQuery);
        if(e.keyCode == 13 && searchQuery.length){
            setBlogs(null);
            setDrafts(null);
        }
    }

    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Toaster />
            
            {/* Clean Header - Medium Style */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">Manage Blogs</h1>
                    <p className="text-lg text-dark-grey">Create, edit, and manage your blog posts</p>
                </div>

                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <input 
                            type="search"
                            className="w-full bg-white border border-grey/30 px-4 py-3 pl-10 rounded-lg placeholder:text-dark-grey focus:outline-none focus:border-black transition-all duration-200"
                            placeholder="Search your blogs..."
                            onChange={handleChange}
                            onKeyDown={handleSearch}
                        />
                        <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-dark-grey"></i>
                    </div>
                    <Link 
                        to="/editor"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-dark-grey transition-colors duration-200"
                    >
                        <i className="fi fi-rr-plus text-sm"></i>
                        Write New Blog
                    </Link>
                </div>

                {/* Tab Navigation - Medium Style */}
                <div className="border-b border-grey/30 mb-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("published")}
                            className={`pb-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                                activeTab === "published" 
                                    ? "border-black text-black" 
                                    : "border-transparent text-dark-grey hover:text-black"
                            }`}
                        >
                            Published Blogs
                        </button>
                        <button
                            onClick={() => setActiveTab("drafts")}
                            className={`pb-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                                activeTab === "drafts" 
                                    ? "border-black text-black" 
                                    : "border-transparent text-dark-grey hover:text-black"
                            }`}
                        >
                            Drafts
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeTab === "published" ? (
                        // Published Blogs
                        blogs == null ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : blogs.results.length ? (
                            <>
                                <div className="space-y-6">
                                    {blogs.results.map((blog, i) => (
                                        <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                            <ManagePublishedBlogCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                        </AnimationWrapper>
                                    ))}
                                </div>
                                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} additionalParam={{ draft: false, deletedDocCount: 0 }} />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-grey/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fi fi-rr-document text-2xl text-dark-grey"></i>
                                </div>
                                <h3 className="text-xl font-medium text-black mb-2">No published blogs</h3>
                                <p className="text-dark-grey mb-6">You haven't published any blogs yet. Start writing to share your thoughts!</p>
                                <Link
                                    to="/editor"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-dark-grey transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-edit text-sm"></i>
                                    Write your first blog
                                </Link>
                            </div>
                        )
                    ) : (
                        // Drafts
                        drafts == null ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : drafts.results.length ? (
                            <>
                                <div className="space-y-6">
                                    {drafts.results.map((blog, i) => (
                                        <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                            <ManagePublishedBlogCard blog={{ ...blog, index: i, setStateFunc: setDrafts }} />
                                        </AnimationWrapper>
                                    ))}
                                </div>
                                <LoadMoreDataBtn state={drafts} fetchDataFun={getBlogs} additionalParam={{ draft: true, deletedDocCount: 0 }} />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-grey/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fi fi-rr-file-edit text-2xl text-dark-grey"></i>
                                </div>
                                <h3 className="text-xl font-medium text-black mb-2">No drafts saved</h3>
                                <p className="text-dark-grey mb-6">You don't have any draft blogs. Save your work as drafts to continue later!</p>
                                <Link
                                    to="/editor"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-dark-grey transition-colors duration-200"
                                >
                                    <i className="fi fi-rr-edit text-sm"></i>
                                    Start writing
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageBlogs;
