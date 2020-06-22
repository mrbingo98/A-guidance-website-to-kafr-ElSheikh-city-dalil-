const multer = require('multer'),

    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
            cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname)
        }
    })
upload = multer({ storage: storage }), mongoConnectURL = process.env.mongoConnectURL;
module.exports = upload;