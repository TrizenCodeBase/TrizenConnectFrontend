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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 text-black px-2 sm:px-0">
        {blog.title}
      </h1>
      
      {/* Subtitle/Description */}
      {blog.des && (
        <div className="text-xl md:text-2xl text-dark-grey mb-6 sm:mb-8 font-normal leading-relaxed px-2 sm:px-0">
          {blog.des}
        </div>
      )}
      
      {/* Author Info Row */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-grey px-2 sm:px-0">
        <img
          src={blog.author?.personal_info?.profile_img}
          alt={blog.author?.personal_info?.fullname}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 mt-1 sm:mt-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
            <span className="font-medium text-black text-sm sm:text-base truncate">{blog.author?.personal_info?.fullname}</span>
            <FollowButton 
              authorId={blog.author?._id} 
              authorUsername={blog.author?.personal_info?.username} 
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-grey">
            <span>{getReadTime()}</span>
            <span>•</span>
            <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      {blog.banner && (
        <img
          src={blog.banner}
          alt={blog.title}
          className="w-full h-auto object-cover mb-8 sm:mb-12 rounded-lg"
        />
      )}
      
      {/* Blog Content */}
      <div className="prose prose-sm sm:prose-lg max-w-none px-2 sm:px-0">
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

