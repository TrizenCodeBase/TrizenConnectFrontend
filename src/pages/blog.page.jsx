import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import PageNotFound from "./404.page";
import BlogPostCard from "../components/blog-post.component";
import axios from "axios";
import EditorJsRenderer from "editorjs-react-renderer";
import BlogInteraction from "../components/blog-interaction.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import FollowButton from "../components/follow-button.component";
import { config } from "../config/environment.js";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let { userAuth: { access_token } } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setBlog(null);
    axios
      .get(config.serverDomain + "/blog/" + id)
      .then(async (res) => {
        try {
          const blogData = res.data.blog;
          
          // Initialize comments structure
          const commentsData = await fetchComments({ 
            blog_id: blogData._id, 
            setParentCommentCountFun: setTotalParentCommentsLoaded 
          });

          // Ensure proper structure
          blogData.comments = commentsData || { results: [] };
          
          setBlog(blogData);
          setLoading(false);
        } catch (commentError) {
          console.error("Error fetching comments:", commentError);
          // Still set the blog even if comments fail
          setBlog({ ...res.data.blog, comments: { results: [] } });
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(
          err.response && err.response.status === 404
            ? "notfound"
            : "error"
        );
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error === "notfound") return <PageNotFound />;
  if (error) return <div className="text-center text-red-500">Failed to load blog.</div>;
  if (!blog || !blog.blog_id) return null;

  // Estimate read time (simple: 200 words/min)
  const getReadTime = () => {
    if (!blog.content || !Array.isArray(blog.content.blocks)) return '';
    const text = blog.content.blocks.map(b => b.data.text || '').join(' ');
    const words = text.split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 mt-12">
      {/* Banner Image */}
      {blog.banner && (
        <img
          src={blog.banner}
          alt={blog.title}
          className="w-full h-[400px] md:h-[500px] object-cover rounded-t-2xl mb-12"
        />
      )}
      {/* Title */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 text-gray-900 text-left">
        {blog.title}
      </h1>
      {/* Subtitle/Description */}
      {blog.des && (
        <div className="text-3xl md:text-4xl text-gray-600 mb-8 font-light max-w-4xl text-left">
          {blog.des}
        </div>
      )}
      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-500 text-2xl md:text-3xl text-left">
        <img
          src={blog.author?.personal_info?.profile_img}
          alt={blog.author?.personal_info?.fullname}
          className="w-10 h-10 rounded-full border"
        />
        <span className="font-semibold text-gray-700">{blog.author?.personal_info?.fullname}</span>
        <span className="text-gray-400">@{blog.author?.personal_info?.username}</span>
        <span className="hidden md:inline">•</span>
        <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
        <span className="hidden md:inline">•</span>
        <span>{getReadTime()}</span>
        <FollowButton 
          authorId={blog.author?._id} 
          authorUsername={blog.author?.personal_info?.username} 
        />
      </div>
      {/* Blog Content */}
      <div className="editorjs-renderer-blocks">
        {blog.content && blog.content.blocks && blog.content.blocks.length > 0 ? (
          <EditorJsRenderer data={blog.content} />
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* Blog Interactions */}
      <AnimationWrapper>
        <BlogInteraction 
          blog={blog} 
          setBlog={setBlog} 
          commentsWrapper={commentsWrapper}
          setCommentsWrapper={setCommentsWrapper}
        />
      </AnimationWrapper>

      {/* Comments Section */}
      <CommentsContainer 
        blog={blog} 
        setBlog={setBlog} 
        commentsWrapper={commentsWrapper} 
        setCommentsWrapper={setCommentsWrapper} 
      />
    </div>
  );
};

export default BlogPage;

