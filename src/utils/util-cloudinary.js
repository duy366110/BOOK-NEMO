const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

class CLOUDINARY {

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME || 'doxnf7bp0',
            api_key: process.env.CLOUDINARY_KEY || '118274391485986',
            api_secret: process.env.CLOUDINARY_SECRET || 'duLeYaATcZGYz4gQfNk3BCF7zBw',
        })
    }

    // UPLOAD FILE LÊN CLOUD
    storage = new CloudinaryStorage({
        cloudinary,
        allowedFormats: ['jpeg', 'jpg', 'png'],
        filename: function (req, file, cb) {
            cb(null, file.originalname); 
        },
        params: {
            folder: 'book_nemo',
        }
    })

    // KIEN TRA FILE TON TAI TREN CLOUD
    exists = async (public_id, cb) => {
        try {
            let result = await cloudinary.api.resource(public_id);
            cb({status: true, result});


        } catch (err) {
            cb({status: false, result: null});
        }
    }



    // XOÁ FILE TRÊN CLOUD
    destroy = async (path, cb) => {
        try {
            let status = await cloudinary.api.delete_resources_by_prefix(path);
            cb({status: true, message: 'Delete image successfully'});


        } catch (err) {
            cb({status: false, message: 'Delete image failed'});
        }
    }
}

module.exports = new CLOUDINARY();