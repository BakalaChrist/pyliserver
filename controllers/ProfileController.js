const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


router.post('/add-profile', (req, res) => {
    const values = [ req.body.libelle ];
    const sql = "INSERT INTO profil (libelle_profil) VALUES (?)";
    db.query(sql, [values], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        
        return res.json({message: "Profile added successfull !", valid: true});
    });
});

router.post('/update-profile/:id', (req, res) => {
    const sql ="UPDATE profil SET `libelle_profil`=? WHERE id_profil=?";
    const id = req.params.id;
    db.query(sql, [req.body.updateLibelle, id ],
    (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({message: "Profile updated successfull !", valid: true});
    });
});

router.post('/delete_profile/:id', (req, res) => {
    const sql = "DELETE FROM profil WHERE id_profil=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
            return res.json({message: "Profile deleted successfull !", valid: true});
    });
});

router.get('/add-profile', (req, res) => {
    const sql = "SELECT * FROM profil";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: "Une erreur est survenue !", valid: false});
        return res.json({result:result, valid: true});
    });
});
 
module.exports = router;
