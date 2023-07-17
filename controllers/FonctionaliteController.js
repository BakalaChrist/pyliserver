const express = require('express');
const mysql = require('mysql');


const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pyli',
});


router.get('/liste-fonctionalite', (req, res) => {
  const sql = 'SELECT * FROM `fonctionalite`';
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: 'Erreur au niveau du serveur' });
    return res.json(result);
  });
});


router.post('/add_fonctionalite', (req, res) => {
  const sql = 'INSERT INTO `fonctionalite`( `libelle`, `status`, `types_link`, `date_creation`, `icon`) VALUES (? , ?, ?, ? ,?)';
  const values = [req.body.libelle, req.body.status, req.body.types_link, req.body.date, req.body.icon];
  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


router.get('/read_fonctionalite/:id', (req, res) => {
  const sql = 'SELECT * FROM `fonctionalite` WHERE id_fonctionnalite = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});

router.post('/update_fonctionalite/:id', (req, res) => {
  const sql = 'UPDATE `fonctionalite` SET libelle=?, status=?, types_link=?, date_creation=?, icon=? WHERE id_fonctionnalite = ?';
  const id = req.params.id;
  db.query(sql, [req.body.libelle, req.body.status, req.body.types_link, req.body.date, req.body.icon, id], (err, result) => {
    if (err) return res.json();
    return res.json(result);
  });
});


router.post('/delete_fonctionalite/:id', (req, res) => {
  const sql = 'DELETE FROM `fonctionalite` WHERE id_fonctionnalite = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json();
    return res.json({result:result,valid:true});
  });
});

module.exports = router;
