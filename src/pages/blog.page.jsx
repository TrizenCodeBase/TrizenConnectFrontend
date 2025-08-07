import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import PageNotFound from "./404.page";
import BlogPostCard from "../components/blog-post.component";
import axios from "axios";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setBlog(null);
    axios
      .get(
        (import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000") +
          "/blog/" +
          id
      )
      .then((res) => {
        setBlog(res.data.blog);
        setLoading(false);
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

  console.log("Blog fetched for display:", blog);

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
        <button className="ml-4 px-4 py-1 border border-gray-300 rounded-full text-lg md:text-xl font-medium hover:bg-gray-100 transition">Follow</button>
      </div>
      {/* Blog Content */}
      <div className="prose max-w-none text-gray-900 text-left" style={{ fontSize: '2.25rem', fontFamily: 'serif' }}>
        {blog.content && Array.isArray(blog.content.blocks) && blog.content.blocks.length > 0 ? (
          blog.content.blocks.map((block, idx) => {
            switch (block.type) {
              case "paragraph":
                return <p style={{ fontSize: '1.55rem' }} key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              case "header": {
                const Tag = `h${block.data.level}`;
                return <Tag key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
              }
              case "list":
                if (block.data.style === "ordered") {
                  return <ol key={idx}>{block.data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>;
                } else {
                  return <ul key={idx}>{block.data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>;
                }
              case "image":
                return (
                  <div key={idx} className="my-8 flex flex-col items-center">
                    <img src={block.data.file?.url} alt={block.data.caption || "Blog image"} className="max-w-full h-auto rounded-xl" />
                    {block.data.caption && <div className="text-center text-base text-gray-500 mt-2">{block.data.caption}</div>}
                  </div>
                );
              case "quote":
                return (
                  <blockquote key={idx} className="border-l-4 pl-4 italic my-8 text-gray-600 text-2xl">
                    <span dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.data.caption && <footer className="text-right text-xs mt-2">{block.data.caption}</footer>}
                  </blockquote>
                );
              case "code":
                return <pre key={idx} className="bg-gray-100 p-4 rounded text-xl overflow-x-auto"><code>{block.data.code}</code></pre>;
              case "delimiter":
                return <hr key={idx} className="my-12" />;
              case "raw":
                return <div key={idx} dangerouslySetInnerHTML={{ __html: block.data.html }} />;
              default:
                return null;
            }
          })
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

