const express = require('express');
const mysql = require('mysql');
var multer = require('multer');
const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


var posts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/posts')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


router.get('/get-posts-files/:id', (req, res) => {
    const sql = "SELECT * FROM image WHERE id_post = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

router.post('/edit-image/:id', (req, res) => {
    
    let upload = multer({ storage: posts}).single('image');
     upload(req, res, function (err) {
         if (!req.file) {
           return res.send({message: 'Please select an image to upload', valid: false});
         } else if (err instanceof multer.MulterError) {
           return res.send(err);
         }else if(err){
             return res.send(err);
         }
         
        const sql ="UPDATE image SET `photo`=? WHERE id_image=?";
        const id = req.params.id;
         
        db.query(sql, [req.file.filename, id ],
            (err, result) => {
                if(err) return res.json({message: "Une erreur est survenue !", valid: false});
                return res.json({message: "Image updated successfull !", valid: true});
        });
         
       });   
 });

 router.post('/delete-image/:id', (req, res) => {
    const sql = "DELETE FROM image WHERE id_image=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Image deleted successfull !", valid: true});
    });
});

module.exports = router;
