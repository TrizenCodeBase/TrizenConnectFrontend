// import { useContext, useState } from "react";
// import { UserContext } from "../App";
// import { Navigate } from "react-router-dom";
// import PublishForm from "../components/publish-form.component";
// import BlogEditor from "../components/blog-editor.component";
// import { createContext } from "react";

// const blogStructure = {
//     title:'',
//     banner:'',
//     content:[],
//     tags:[],
//     des:'',
//     author:{personal_info:{ }}
// }

// export const EditorContext = createContext({});

// export const Editor = () => {

//     const [ blog, setBlog] = useState(blogStructure);
//     const [ editorState, setEditorState ] = useState("editor");

//     let { userAuth: { access_token } } = useContext(UserContext)

//     return(
//         <>
//         <EditorContext.Provider value={{blog, setBlog, editorState, setEditorState }}>
//         {
//         access_token === null ? <Navigate to="/signin" />
//         : editorState === "editor" ? <BlogEditor /> : <PublishForm />
//         }
//         </EditorContext.Provider>
//         </>
//     )
// }
import { useContext, useState, createContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import { config } from "../config/environment.js";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const { blog_id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(!!blog_id); // Only show loading if editing
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({isReady: false});

  let {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  // Load existing blog data if blog_id is provided
  useEffect(() => {
    if (blog_id && access_token) {
      setLoading(true);
      
      axios.get(`${config.serverDomain}/blog/${blog_id}`)
        .then(({ data }) => {
          const blogData = data.blog;
          
          if (!blogData) {
            toast.error("Blog not found");
            navigate("/dashboard/blogs");
            return;
          }
          
          // Check if current user is the author
          if (blogData.author?.personal_info?.username !== username) {
            toast.error("You don't have permission to edit this blog");
            navigate("/dashboard/blogs");
            return;
          }

          // Set the blog data for editing
          setBlog({
            title: blogData.title || "",
            banner: blogData.banner || "",
            content: blogData.content || [],
            tags: blogData.tags || [],
            des: blogData.des || "",
            author: blogData.author || { personal_info: {} },
            blog_id: blogData.blog_id // Use the public blog_id, not the MongoDB _id
          });

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading blog:", error);
          toast.error("Failed to load blog for editing");
          navigate("/dashboard/blogs");
        });
    }
  }, [blog_id, access_token, username, navigate]);

  if (access_token === null) {
    return <Navigate to="/signin" />;
  }

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-dark-grey">
            {loading ? "Loading blog for editing..." : "Initializing editor..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{
      blog, 
      setBlog, 
      editorState, 
      setEditorState, 
      textEditor, 
      setTextEditor,
      blog_id // Pass blog_id to context for updating vs creating
    }}>
      {editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
