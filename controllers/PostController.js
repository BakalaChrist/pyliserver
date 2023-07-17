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


router.post('/add-post', (req, res) => {
    
    let upload = multer({ storage: posts}).array('image', 12);
    upload(req, res, function (err) {

        if (!req.files) {
          return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
          return res.send(err);
        }else if(err){
            return res.send(err);
        }

        var lastId = 0;
        const values = [
            req.body.title,
            Date.now(),
            1, //source
            0, //type post
            "localite",
            req.body.desc,
            6, //id_user
            req.body.category,
        ];
        const sql = "INSERT INTO post (titre_post, date_post, source_post, type_post, localite_post, description_post, id_user, id_categorie) VALUES (?)";
        db.query(sql, [values], (err, result) => {
            if(err) return res.json(err);
    
            if(req.files.length > 0){
                for(var i=0; i < req.files.length; i++){
                    //console.log("lastId: "+lastId);
                    //console.log(req.files[i].filename+" "+ i +"***********************");
    
                    const sql2 = "INSERT INTO image (photo, rang, id_post, date_creation) VALUES (?)";
                    const values2 = [
                        req.files[i].filename,
                        i,
                        result.insertId,
                        Date.now(),
                    ];
            
                    db.query(sql2, [values2], (err2, result2) => {
                        
                    });
    
                }
            }
            return res.json({result,valid: true});
        });

      });    
});

router.get('/get-posts', (req, res) => {
    const sql = "SELECT * FROM post";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});

router.post('/delete-post/:id', (req, res) => {
    const sql = "DELETE FROM post WHERE id_post=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Post deleted successfull !", valid: true});
    });
});

router.get('/details-post/:id', (req, res) => {
    const sql = "SELECT * FROM post WHERE id_post = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

router.post('/edit-post/:id', (req, res) => {
    
    const sql ="UPDATE post SET `titre_post`=?, `description_post`=?, `id_categorie`=? WHERE id_post=?";
    const id = req.params.id;

    db.query(sql, [req.body.title, req.body.desc, req.body.category, id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Post updated successfull !", valid: true});
    });    
 });

 
module.exports = router;
