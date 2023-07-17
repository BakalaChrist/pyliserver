const express = require('express');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


router.get('/liste-actionSystem', (req, res) => {
  const sql = 'SELECT * FROM `action_systeme`';
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: 'Erreur au niveau du serveur' });
    return res.json(result);
  });
});


router.post('/add-actionSystem', (req, res) => {
  const sql = 'INSERT INTO `action_systeme`( `libelle`, `status`, `date_creation`) VALUES (? , ?, ?)';
  const values = [req.body.libelle, req.body.status,req.body.date];
  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


router.get('/read-actionSystem/:id', (req, res) => {
  const sql = 'SELECT * FROM `action_systeme` WHERE id_action_systeme = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});

router.post('/update-actionSystem/:id', (req, res) => {
  const sql = 'UPDATE `action_systeme` SET libelle=?, status=? WHERE id_action_systeme = ?';
  const id = req.params.id;
  db.query(sql, [req.body.libelle, req.body.status, id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});


router.post('/delete-actionSystem/:id', (req, res) => {
  const sql = 'DELETE FROM `action_systeme` WHERE id_action_systeme = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json({result:result,valid:true});
  });
});

module.exports = router;
