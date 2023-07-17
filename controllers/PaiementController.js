const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


router.get('/liste-paiement', (req, res) => {
  const sql = 'SELECT * FROM `mode_paiement`';
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: 'Erreur au niveau du serveur' });
    return res.json(result);
  });
});


router.post('/add-paiement', (req, res) => {
  const sql = 'INSERT INTO `mode_paiement`( `libelle`) VALUES (?)';
  const values = [req.body.libelle];
  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


router.get('/read-paiement/:id', (req, res) => {
  const sql = 'SELECT * FROM `mode_paiement` WHERE id_mode_paiement = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});

router.post('/update-paiement/:id', (req, res) => {
  const sql = 'UPDATE `mode_paiement` SET libelle=? WHERE id_mode_paiement = ?';
  const id = req.params.id;
  db.query(sql, [req.body.libelle, id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});


router.post('/delete-paiement/:id', (req, res) => {
  const sql = 'DELETE FROM `mode_paiement` WHERE id_mode_paiement = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json({result:result,valid:true});
  });
});

module.exports = router;
