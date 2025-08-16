import React, { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";


const Tag = ({ tag, tagIndex }) => {

  let {blog, blog: {tags}, setBlog } = useContext(EditorContext);

  const addEditable = (e) => {
    e.target.setAttribute("contenteditable", true);
    e.target.focus();
  }

  const handleTagEdit = (e) => {
    if(e.keyCode === 13 || e.keyCode === 188){
      e.preventDefault();
      let currentTag = e.target.innerText;
      
      tags[tagIndex] = currentTag;

      setBlog({...blog, tags})
      e.target.setAttribute("contenteditable", false);
    }
  }

  const handleTagDelete = () => {
    tags = tags.filter((t) => t !== tag);
    setBlog({...blog, tags})
  }

  return (
    <div className="relative p-2 mr-2 mt-2 px-5 bg-grey rounded-full inline-block hover:bg-opacity-50 pr-10 border border-dark-grey/20">
      <p className="outline-none text-black" onClick={addEditable}
        onKeyDown={handleTagEdit}
      >
        {tag}
      </p>
      <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center hover:bg-red/20"
      onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-xs pointer-events-none text-dark-grey"></i>
      </button>
    </div>
  );
};

export default Tag;
