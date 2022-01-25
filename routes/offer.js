const express = require("express");
const router = express.Router();
const Annonce = require("../models/offers.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.username + ".jpg");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter,
});

//adding and update annonce image
router
  .route("/add/imageannonce")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {


    const update = {
      img: req.file.path,
    }
      Annonce.updateMany(update, (err,annonce) => {
  
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: annonce,
        };
        return res.status(200).send(response);
      
      })
     
  });
router.route("/addannonce").post( (req, res) => {
  const annonce = new Annonce({
 
    nomentr: req.body.nomentr,
    poste: req.body.poste,
    anexp: req.body.anexp,
    descentr: req.body.descentr,
    descpost: req.body.descpost,
    typecont: req.body.typecont,
    sexe: req.body.sexe,
    adress: req.body.adress,
    salaire: req.body.salaire,
    skills: req.body.skills,
    user:req.body.user,
      
  });
  annonce
    .save()
    .then(() => {
      return res.json({ msg: "Annonce successfully stored" });
    })
    .catch((err) => {
      return res.status(400).json({ err: err });
    });
});

// Check annonce data

router.route("/checkannonce").get(middleware.checkToken, (req, res) => {
  Annonce.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    else if (result == null) {
      return res.json({ status: false, username: req.decoded.username });
    } else {
      return res.json({ status: true, username: req.decoded.username });
    }
  });
});
router.route("/getDataannonce").get(middleware.checkToken, (req, res) => {
  Annonce.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    if (result == null) return res.json({ data: [] });
    else return res.json({ data: result });
  });
});
router.route("/findoffer").get((req,res)=>{
    Annonce.find().then((data) => {
    res.json(data);
            });
        }
    );
    router.route("/id/:_id").get(middleware.checkToken, (req, res) => {
      Annonce.findOne({ _id: req.params._id }, (err, result) => {
        if (err) return res.json({ err: err });
        else  res.json({ data: result });
      });
    });

module.exports = router;