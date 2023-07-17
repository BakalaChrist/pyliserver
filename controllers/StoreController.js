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

const stores = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/stores')
      },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
});


router.post('/add-store', (req, res) => {
    
    let upload = multer({ storage: stores}).single('image');
     upload(req, res, function (err) {
         if (!req.file) {
           return res.send('Please select an image to upload');
         } else if (err instanceof multer.MulterError) {
           return res.send(err);
         }else if(err){
             return res.send(err);
         }
 
        const sql = "INSERT INTO virtual_market (nom_vm, image_vm, id_user, email_vm, adresse_vm, siteweb_vm, slogan, tel_vm, about_vm) VALUES (?)";
         const values = [
             req.body.name,
             req.file.filename,
             6,
             req.body.email,
             req.body.address,
             req.body.website,
             req.body.slogan,
             req.body.phone,
             req.body.about,
             
         ];
         
         db.query(sql, [values], (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Store added successfull !", valid: true});
         });
         //console.log(values);
         
       });
     
 });

 router.get('/get-stores', (req, res) => {
    const sql = "SELECT * FROM virtual_market";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});

router.get('/details-store/:id', (req, res) => {
    const sql = "SELECT * FROM virtual_market WHERE id_vm = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

router.post('/edit-store/:id', (req, res) => {
    
    let upload = multer({ storage: stores}).single('image');
     upload(req, res, function (err) {
         if (!req.file) {
           return res.send({message: 'Please select an image to upload', valid: false});
         } else if (err instanceof multer.MulterError) {
           return res.send(err);
         }else if(err){
             return res.send(err);
         }
         
        const sql ="UPDATE virtual_market SET `nom_vm`=?, `image_vm`=?, `email_vm`=?, `adresse_vm`=?, `siteweb_vm`=?, `slogan`=?, `tel_vm`=?, `about_vm`=? WHERE id_vm=?";
        const id = req.params.id;

        db.query(sql, [req.body.name, req.file.filename, req.body.email, req.body.address, req.body.website, req.body.slogan, req.body.phone, req.body.about, id ],
            (err, result) => {
                if(err) return res.json({message: "Une erreur est survenue !", valid: false});
                return res.json({message: "Store updated successfull !", valid: true});
        });
         //console.log(req.file);
         
       });
     
 });

 router.post('/delete-store/:id', (req, res) => {
    const sql = "DELETE FROM virtual_market WHERE id_vm=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Store deleted successfull !", valid: true});
    });
});

module.exports = router;