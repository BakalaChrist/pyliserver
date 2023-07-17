const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


router.get('/liste-categorie', (req, res) => {
  const sql = 'SELECT * FROM `categorie`';
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: 'Erreur au niveau du serveur' });
    return res.json(result);
  });
});


router.post('/add-categorie', (req, res) => {
  const sql = 'INSERT INTO `categorie`( `nom_categorie`,`date_creation`) VALUES (? , ?)';
  const values = [req.body.nom,req.body.date];
  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


router.get('/read-categorie/:id', (req, res) => {
  const sql = 'SELECT * FROM `categorie` WHERE id_categorie = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});

router.post('/update-categorie/:id', (req, res) => {
  const sql = 'UPDATE `categorie` SET nom_categorie=?, date_creation=? WHERE id_categorie = ?';
  const id = req.params.id;
  db.query(sql, [req.body.nom, req.body.date, id], (err, result) => {
    if (err) return res.json();
    return res.json({result:result,valid:true});
  });
});


router.post('/delete-categorie/:id', (req, res) => {
  const sql = 'DELETE FROM `categorie` WHERE id_categorie = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json({result:result,valid:true});
  });
});

module.exports = router;
