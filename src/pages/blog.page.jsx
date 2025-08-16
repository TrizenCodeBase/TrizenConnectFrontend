import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  let { userAuth: { access_token, username } } = useContext(UserContext);

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

  // Debug: Log the blog content structure
  console.log("Blog content structure:", blog.content);
  console.log("Blog content blocks:", blog.content?.blocks);
  console.log("Blog content blocks length:", blog.content?.blocks?.length);

  // Estimate read time (simple: 200 words/min)
  const getReadTime = () => {
    if (!blog.content || !Array.isArray(blog.content.blocks)) return '';
    const text = blog.content.blocks.map(b => b.data.text || '').join(' ');
    const words = text.split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  };

  // Function to clean HTML content while preserving formatting
  const cleanHtmlContent = (content) => {
    if (!content) return '';
    
    // Replace common HTML entities
    let cleaned = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    return cleaned.trim();
  };

  // Function to clean HTML content completely (for section headers)
  const cleanHtmlContentCompletely = (content) => {
    if (!content) return '';
    
    // Replace common HTML entities
    let cleaned = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Remove any remaining HTML tags that shouldn't be visible
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    return cleaned.trim();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-black">
        {blog.title}
      </h1>
      
      {/* Subtitle/Description */}
      {blog.des && (
        <div className="text-xl text-dark-grey mb-8 font-normal leading-relaxed">
          {blog.des}
        </div>
      )}
      
      {/* Author Info Row */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-8 pb-8 border-b border-grey/30">
        <img
          src={blog.author?.personal_info?.profile_img}
          alt={blog.author?.personal_info?.fullname}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 mt-1 sm:mt-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <span className="font-medium text-black text-sm sm:text-base truncate">{blog.author?.personal_info?.fullname}</span>
            <FollowButton 
              authorId={blog.author?._id} 
              authorUsername={blog.author?.personal_info?.username} 
            />
            {/* Edit Button for Author */}
            {username === blog.author?.personal_info?.username && (
              <Link
                to={`/editor/${blog.blog_id}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-dark-grey hover:text-black transition-colors duration-200"
              >
                <i className="fi fi-rr-edit text-xs"></i>
                Edit
              </Link>
            )}
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
          className="w-full h-auto object-cover mb-12 rounded-lg"
        />
      )}
      
      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        {blog.content && blog.content.blocks && blog.content.blocks.length > 0 ? (
          <>
            
                         {/* Custom Content Renderer */}
             <div className="blog-content">
               {blog.content.blocks.map((block, index) => {
                 switch (block.type) {
                   case 'header':
                   case 'heading1':
                   case 'heading2':
                   case 'heading3':
                   case 'heading4':
                   case 'heading5':
                   case 'heading6':
                     const level = block.data.level || 2;
                     const Tag = `h${level}`;
                     return (
                       <Tag key={index} className={`heading-${level}`}>
                         {block.data.text}
                       </Tag>
                     );
                   
                                       case 'paragraph':
                                             // Check if this paragraph contains the problematic HTML
                       if (block.data.text.includes('<b>') && block.data.text.includes('For Instructors')) {
                         const emojiMatch = block.data.text.match(/👩‍🏫|👨‍🎓|🎓/);
                         const emoji = emojiMatch ? emojiMatch[0] : '';
                         const cleanText = cleanHtmlContentCompletely(block.data.text);
                         const sectionName = cleanText.replace(emoji, '').trim();
                         
                         return (
                           <h3 key={index} className="text-xl font-bold text-black mb-2 mt-6">
                             {emoji} {sectionName}
                           </h3>
                         );
                       }
                      
                      return (
                        <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                      );
                   
                                       case 'list':
                      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                      return (
                        <ListTag key={index} className="list-disc pl-6 space-y-2">
                          {block.data.items.map((item, itemIndex) => {
                            // Debug: Log the raw item content
                            console.log(`List item ${itemIndex}:`, item);
                            
                                                         // Special handling for section headers within lists
                             if (item.includes('For Instructors') || item.includes('For Students')) {
                               // Extract emoji and text, remove HTML tags completely
                               const emojiMatch = item.match(/👩‍🏫|👨‍🎓|🎓/);
                               const emoji = emojiMatch ? emojiMatch[0] : '';
                               const cleanText = cleanHtmlContentCompletely(item);
                               const sectionName = cleanText.replace(emoji, '').trim();
                               
                               return (
                                 <li key={itemIndex} className="list-none -ml-6 mt-6 mb-4">
                                   <h3 className="text-xl font-bold text-black mb-2">
                                     {emoji} {sectionName}
                                   </h3>
                                 </li>
                               );
                             }
                            
                            // For regular list items, clean up HTML entities and render
                            const cleanItem = cleanHtmlContent(item);
                            return (
                              <li key={itemIndex} className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanItem }} />
                            );
                          })}
                        </ListTag>
                      );
                   
                   case 'quote':
                     return (
                       <blockquote key={index}>
                         <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                         {block.data.caption && (
                           <cite>— {block.data.caption}</cite>
                         )}
                       </blockquote>
                     );
                   
                   case 'image':
                     return (
                       <figure key={index}>
                         <img 
                           src={block.data.file.url} 
                           alt={block.data.caption || ''} 
                           className="w-full h-auto rounded-lg"
                         />
                         {block.data.caption && (
                           <figcaption>{block.data.caption}</figcaption>
                         )}
                       </figure>
                     );
                   
                   case 'embed':
                     return (
                       <div key={index} className="embed-container">
                         <iframe
                           src={block.data.embed}
                           frameBorder="0"
                           allowFullScreen
                           className="w-full aspect-video rounded-lg"
                         />
                       </div>
                     );
                   
                   case 'code':
                     return (
                       <pre key={index}>
                         <code>{block.data.code}</code>
                       </pre>
                     );
                   
                   case 'delimiter':
                     return <hr key={index} />;
                   
                   default:
                     return (
                       <div key={index} style={{border: '1px solid orange', padding: '10px', margin: '10px 0'}}>
                         <p><strong>Unsupported block type:</strong> {block.type}</p>
                         <pre>{JSON.stringify(block.data, null, 2)}</pre>
                       </div>
                     );
                 }
               })}
             </div>
          </>
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

