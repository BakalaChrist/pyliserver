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

/* const storage = multer.diskStorage({
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

var posts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/posts')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
}); */

const Fonctionnalitecontroller = require('../Pyliserver/controllers/FonctionaliteController');
const ActionSystemcontroller = require('../Pyliserver/controllers/ActionSystemController');
const Categoriecontroller = require('../Pyliserver/controllers/CategorieController');
const Paiementcontroller = require('../Pyliserver/controllers/PaiementController');
const Profilecontroller = require('../Pyliserver/controllers/ProfileController');
const Usercontroller = require('../Pyliserver/controllers/UserController');
const Storecontroller = require('../Pyliserver/controllers/StoreController');
const Postcontroller = require('../Pyliserver/controllers/PostController');
const Filescontroller = require('../Pyliserver/controllers/FilesController');

app.use(Fonctionnalitecontroller);
app.use(ActionSystemcontroller);
app.use(Categoriecontroller);
app.use(Paiementcontroller);
app.use(Profilecontroller);
app.use(Postcontroller);
app.use(Usercontroller);
app.use(Storecontroller);
app.use(Filescontroller);

app.listen(8002, () => {
  console.log("listening");
});
