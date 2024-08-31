// import multer from "multer";



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/upload');
//     },
//     filename: function(req,file,cb){
//         const uniqueSuffix =Date.now() +'_' +
//          Math.round(Math.random()*1E9)
//          cb(null, file.fieldname  + '-' + uniqueSuffix);
//     }
// })

// export  const upload = multer({storage})

import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');  // Specifies the directory for storing uploaded files
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'  + Date.now() + path.extname(file.originalname));  // Creates a unique filename for each uploaded file
    }
});

export const upload = multer({ storage: storage });