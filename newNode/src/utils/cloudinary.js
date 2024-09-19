




import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
    
cloudinary.config({ 
       cloud_name: 'dtwftajii', 
       api_key: '462968465744638', 
       api_secret: 'fUxqQQWJEQ3h3ZxCuHiXNiVXRcA' // Click 'View API Keys' above to copy your API secret
   });

const uploadOnCloudinary = async(localFilePath) =>{
       
       try {
              if(!localFilePath) return null
              const response = await cloudinary.uploader.upload(localFilePath)
              fs.unlinkSync(localFilePath)
              return response;
              
              
       } catch (error) {
            fs.unlinkSync(localFilePath)
              
              return null;
       }
}

export {uploadOnCloudinary}

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);