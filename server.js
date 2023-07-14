var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const app = express();

const corsOptions ={origin: "http://localhost:3000",
methods: ["GET", "POST"],
credentials: true,
}
app.use(cors(corsOptions));
app.use(express.static('public/uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profiles')
      },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
});

const stores = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/stores')
      },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      }
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pyli"
});

app.get('/', (req, res) => {
    res.send("ok");
});

//PROFILE CRUD
app.post('/add-profile', (req, res) => {
    const values = [
        req.body.libelle,
    ];
    const sql = "INSERT INTO profil (libelle_profil) VALUES (?)";
    db.query(sql, [values], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({message: "Profile added successfull !", valid: true});
    });
});

app.post('/update-profile/:id', (req, res) => {
    const sql ="UPDATE profil SET `libelle_profil`=? WHERE id_profil=?";
    const id = req.params.id;
    db.query(sql, [req.body.updateLibelle, id ],
    (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({message: "Profile updated successfull !", valid: true});
    });
});

app.post('/delete_profile/:id', (req, res) => {
    const sql = "DELETE FROM profil WHERE id_profil=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Profile deleted successfull !", valid: true});
    });
});

app.get('/add-profile', (req, res) => {
    const sql = "SELECT * FROM profil";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});
//FIN PROFILE

//USER CRUD
app.post('/add-user', (req, res) => {
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
    //console.log(values);
    const sql = "INSERT INTO user (nom, prenom, email, password, telephone, image_profil, id_pays, id_profile, id_ville, genre, policy) VALUES (?)";
    db.query(sql, [values], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({message: "User added successfull !", valid: true});
    });
});

app.get('/get-users', (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});

app.get('/details-user/:id', (req, res) => {
    const sql = "SELECT * FROM user WHERE id_user = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

app.post('/edit-user/:id', (req, res) => {
  
    const sql ="UPDATE user SET `nom`=?, `prenom`=?, `telephone`=?, `id_pays`=?, `id_ville`=?, `genre`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.last_name, req.body.first_name, req.body.phone, req.body.country, req.body.city, req.body.gender ,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "User added successfull !", valid: true});
    });
});

app.post('/edit-pass/:id', (req, res) => {
  
    const sql ="UPDATE user SET `password`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.pass,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Password updated successfull !", valid: true});
    });
});

app.post('/edit-email/:id', (req, res) => {
  
    const sql ="UPDATE user SET `email`=? WHERE id_user=?";
    const id = req.params.id;

    db.query(sql, [req.body.email,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Password updated successfull !", valid: true});
    });
});

app.post('/delete_user/:id', (req, res) => {
    const sql = "DELETE FROM user WHERE id_user=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "User deleted successfull !", valid: true});
    });
});

app.post('/change-profile/:id', (req, res) => {
    
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

//FIN USER

//STORE CRUD
app.post('/add-store', (req, res) => {
    
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

 app.get('/get-stores', (req, res) => {
    const sql = "SELECT * FROM virtual_market";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});

app.get('/details-store/:id', (req, res) => {
    const sql = "SELECT * FROM virtual_market WHERE id_vm = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) =>{
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    })
});

app.post('/edit-store/:id', (req, res) => {
    
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

 app.post('/delete-store/:id', (req, res) => {
    const sql = "DELETE FROM virtual_market WHERE id_vm=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Store deleted successfull !", valid: true});
    });
});
//FIN STORE


app.listen(8002, () => {
    console.log("listening");
});