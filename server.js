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

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pyli"
});

app.get('/', (req, res) => {
    res.send("ok");
});

//PROFILE
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

//USER
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

    db.query(sql, [req.body.last_name, req.body.first_name, req.body.phone, req.body.country, req.body.city, req.body.genre ,id ],
        (err, result) => {
            if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "User added successfull !", valid: true});
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

//FIN USER


app.listen(8002, () => {
    console.log("listening");
});