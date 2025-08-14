// import axios from "axios";

// export const uploadImage = async (img) => {
//     let imgUrl = null;

//     await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
//     .then( async ({data : {uploadURL}}) => {

//         await axios({
//             method : 'PUT',
//             url: uploadURL,
//             headers : {'Content-Type':'multipart/form-data'},
//             data: img
//         })
//         .then(() => {
//             imgUrl = uploadURL.split("?")[0]
//         })
//     })

//     return imgUrl;
// }
import axios from 'axios';
import { config } from "../config/environment.js";

export const uploadImage = async (img) =>{
    let imgUrl = null;
    
    try {
        const {data:{uploadURL}} = await axios.get(config.serverDomain + '/get-upload-url');
        
        await axios({
            method: 'PUT',
            url: uploadURL,
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            data: img
        });
        
        imgUrl = uploadURL.split('?')[0];
        return imgUrl;
    } catch (error) {
        console.error("AWS upload error:", error);
        
        // If AWS is not configured, return a placeholder image for testing
        if (error.response?.data?.error?.includes("AWS credentials not configured")) {
            console.log("AWS not configured, using placeholder image for testing");
            return "https://via.placeholder.com/800x400/cccccc/666666?text=Upload+Your+Banner+Here";
        }
        
        throw new Error(error.response?.data?.error || error.message || "Failed to upload image");
    }
}