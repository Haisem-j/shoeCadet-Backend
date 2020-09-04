const router = require('express').Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const { connection } = require('../database');


const Shoe = require('../models/Shoe');

/**
 * These are responsible for uploading images to the database
 */

// Initialize GFS stream
let gfs;
connection.once("open", () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GFS connected");
});


// Create Storage Engine
const storage = new GridFsStorage({
    url: process.env.DB_CONNECT,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });


/**
 * This route will check the database for all shoe releases
 * and return an array of all the shoe objects to the client
 */
router.get('/', async (req, res) => {
    try {
        const allShoes = await Shoe.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


/**
 * This route is responsible for adding in a new Shoe entry into 
 * the database
 */
router.post('/addShoe', upload.single("file"), async (req, res) => {
    let temp = [];
    req.body.size.split(',').forEach(item => temp.push(Number(item)))
    const shoe = new Shoe({
        title: req.body.title,
        price: req.body.price,
        size: temp,
        description: req.body.description,
        imageId: req.file.filename
    });

    try {
        const savedShoe = await shoe.save();
        res.json({ message: "Success" })
    } catch (error) {
        gfs.remove(
            { filename: req.file.filename, root: "uploads" },
            (err, gridStore) => {
                if (err) {
                    return res.status(404).json({
                        err: err
                    });
                }
            }
        );
        res.json({ message: 'Fail' })
    }
})


/**
 * This route will send the info of one shoe using the id
 */
router.get('/shoe/:id', async (req, res) => {
    try {
        const oneShoe = await Shoe.findById(req.params.id, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


/**
 * This route leads to the shoe image
 */
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // CHeck if files
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exist"
            });
        }

        // check if file is image
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // Read Out put to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: "Not an image"
            });
        }
    });
})

/**
 * This route deletes a shoe
 */

router.post("/del/:imageId", async (req, res) => {

    try {
        gfs.remove(
            { filename: req.params.imageId, root: "uploads" },
            (err, gridStore) => {
                if (err) {
                    return res.status(404).json({
                        err: err
                    });
                }
            }
        );
        const shoe = await Shoe.findOneAndDelete({ imageId: req.params.imageId })
        res.json({ message: 'Success' })
    } catch (err) {
        res.json({ "error": err })
    }
});


/**
 * Just a test route, meant for testing functions
 */
router.post('/temp', async (req, res) => {

})




module.exports = router;