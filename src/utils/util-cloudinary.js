require('dotenv').config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const CONFIG_CLOUDINARY = require("../configs/config.cloudinary");

class CLOUDINARY {

    constructor() {
        cloudinary.config({
            cloud_name: CONFIG_CLOUDINARY.NAME,
            api_key: CONFIG_CLOUDINARY.KEY,
            api_secret: CONFIG_CLOUDINARY.SERECT,
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
            folder: CONFIG_CLOUDINARY.DIRECTORY,
        }
    })

    // KIEN TRA FILE TON TAI TREN CLOUD
    exists = async (public_id) => {
        try {
            let result = await cloudinary.api.resource(public_id);
            return {status: true, result};


        } catch (err) {
            return {status: false, result: null};
        }
    }



    // XOÁ FILE TRÊN CLOUD
    destroy = async (path) => {
        try {
            let status = await cloudinary.api.delete_resources_by_prefix(path);
            return {status: true, message: 'Delete image successfully'};


        } catch (err) {
            return {status: false, message: 'Delete image failed'};
        }
    }
}

module.exports = new CLOUDINARY();