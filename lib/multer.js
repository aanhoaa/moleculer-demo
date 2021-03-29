const multer = require("multer");
// const storage = multer.memoryStorage();

const storage = multer.diskStorage({});

function fileFilter(file, file, cb) {
    console.log('file.mimetype', file.mimetype)
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
        return cb(new Error("Định dạng file không hợp lệ"));
    cb(null, true);
}

// const upload = multer({ storage, fileFilter, limits: { fileSize: 10240000 } });
const upload = multer({
    storage,
    fileFilter
});

module.exports = {
    upload
};