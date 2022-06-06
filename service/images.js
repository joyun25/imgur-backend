const path = require("path");
const multer = require("multer");

const upload = multer(
    {
        limits: {
            fileSize: 2*1024*1024 // 檔案大小上限為 2 MB（heroku 免費額度為 512 MB）
        },
        fileFilter(req, file, cb) { // 限制檔案上傳格式
            const ext = path.extname(file.originalname).toLowerCase();
            if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
                cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
            }
            cb(null, true); // 類似 middleware 的 next 的功能
        }
    }
).any();

module.exports = upload;