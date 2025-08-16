// //importing tools

// import Embed from "@editorjs/embed";
// import List from "@editorjs/list";
// import Image from "@editorjs/image";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote";
// import Marker from "@editorjs/marker";
// import InlineCode from "@editorjs/inline-code";

// export const tools = {
//     embed: Embed,
//     list: {
//         class : List,
//         inlineToolbar : true
//     },
//     image: Image,
//     header: {
//         class : Header,
//         config : {
//             placeholder : "Type Heading.....",
//             levels: [2, 3],
//             defaultLevel : 2
//         }
//     },
//     quote: {
//         class: Quote,
//         inlineToolbar : true
//     },
//     marker: Marker,
//     inlineCode: InlineCode
// }
// importing tools

import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/aws";

const uploadImageByURL = async (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: {
        url,
      },
    };
  });
};

const uploadImageByFile = async (e) => {
  return uploadImage(e).then((url) => {
    if (url) {
      return {
        success: 1,
        file: {
          url,
        },
      };
    }
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
    shortcut: 'CMD+SHIFT+H',
  },
  heading1: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 1",
      levels: [1],
      defaultLevel: 1,
    },
  },
  heading2: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 2", 
      levels: [2],
      defaultLevel: 2,
    },
  },
  heading3: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 3",
      levels: [3], 
      defaultLevel: 3,
    },
  },
  heading4: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 4",
      levels: [4],
      defaultLevel: 4,
    },
  },
  heading5: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 5",
      levels: [5],
      defaultLevel: 5,
    },
  },
  heading6: {
    class: Header,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      placeholder: "Heading 6",
      levels: [6],
      defaultLevel: 6,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: ['marker', 'inlineCode'],
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote\'s author',
    },
  },
  marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M',
  },
  inlineCode: {
    class: InlineCode,
    shortcut: 'CMD+SHIFT+C',
  },
};
