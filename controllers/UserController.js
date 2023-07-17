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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profiles')
      },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
});


router.post('/add-user', (req, res) => {
    const values = [
        req.body.last_name,
        req.body.first_name,
        req.body.email,
        req.body.pass,
        req.body.phone,
        "avatar.png",
        req.body.country,
        4,
        req.body.city,
        req.body.gender,
        1
    ];
    console.log(values);
    const sql = "INSERT INTO user (nom, prenom, email, password, telephone, image_profil, id_pays, id_profile, id_ville, genre, policy) VALUES (?)";
    db.query(sql, [values], (err, result) => {
        if(err) return  console.log(err);      //res.json({message: "Une erreur est survenue !", valid: false});
       
        return res.json({message: "User added successfull !", valid: true});
    });
});

router.get('/get-users', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});

router.get('/details-user/:id', (req, res) => {
    const sql = "SELECT * FROM user WHERE id_user = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

router.post('/edit-user/:id', (req, res) => {
  
    const sql ="UPDATE user SET `nom`=?, `prenom`=?, `telephone`=?, `id_pays`=?, `id_ville`=?, `genre`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.last_name, req.body.first_name, req.body.phone, req.body.country, req.body.city, req.body.gender ,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "User added successfull !", valid: true});
    });
});

router.post('/edit-pass/:id', (req, res) => {
  
    const sql ="UPDATE user SET `password`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.pass,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Password updated successfull !", valid: true});
    });
});

router.post('/edit-email/:id', (req, res) => {
  
    const sql ="UPDATE user SET `email`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.email,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Password updated successfull !", valid: true});
    });
});

router.post('/delete_user/:id', (req, res) => {
    const sql = "DELETE FROM user WHERE id_user=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "User deleted successfull !", valid: true});
    });
});

router.post('/change-profile/:id', (req, res) => {
    
    let upload = multer({ storage: storage}).single('image');
     upload(req, res, function (err) {
         if (!req.file) {
           return res.send({message: 'Please select an image to upload', valid: false});
         } else if (err instanceof multer.MulterError) {
           return res.send(err);
         }else if(err){
             return res.send(err);
         }
     
        const sql ="UPDATE user SET `image_profil`=? WHERE id_user=?";
        const id = req.params.id;

        db.query(sql, [req.file.filename,id ],
            (err, result) => {
                if(err) return res.json({message: "Une erreur est survenue !", valid: false});
                return res.json({message: "Profile updated successfull !", valid: true});
        });
         //console.log(req.file);
         
       });
     
 });

 module.exports = router;
