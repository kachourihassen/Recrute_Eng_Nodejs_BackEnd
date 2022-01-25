const express = require("express");
const router = express.Router();
const Societe = require("../models/societe.model");
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

//adding and update Societe image
router
  .route("/add/image")
  .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    Societe.findOneAndUpdate(
      { username: req.decoded.username },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, societe) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: societe,
        };
        return res.status(200).send(response);
      }
    );
  });

router.route("/add/societe").post(middleware.checkToken, (req, res) => {
  const societe = Societe({
    username: req.decoded.username,
    name: req.body.name,
    profession: req.body.profession,
    date: req.body.date,
    titleline: req.body.titleline,
    about: req.body.about,
  });
  societe
    .save()
    .then(() => {
      return res.json({ msg: "Societe successfully stored" });
    })
    .catch((err) => {
      return res.status(400).json({ err: err });
    });
});

// Check Societe data

router.route("/checkSociete").get(middleware.checkToken, (req, res) => {
  Societe.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    else if (result == null) {
      return res.json({ status: false, username: req.decoded.username });
    } else {
      return res.json({ status: true, username: req.decoded.username });
    }
  });
});
router.route("/getData/societe").get(middleware.checkToken, (req, res) => {
    Societe.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    if (result == null) return res.json({ data: [] });
    else return res.json({ data: result });
  });
});
router.route("/update").patch(middleware.checkToken, async (req, res) => {
  let societe = {};
  await Societe.findOne({ username: req.decoded.username }, (err, result) => {
    if (err) {
      societe = {};
    }
    if (result != null) {
      societe = result;
    }
  });
  Societe.updateMany(
    { username: req.decoded.username },
    {
      $set: {
        name: req.body.name ? req.body.name : societe.name,
        profession: req.body.profession
          ? req.body.profession
          : societe.profession,
        date: req.body.date ? req.body.date : societe.date,
        titleline: req.body.titleline ? req.body.titleline : societe.titleline,
        about: req.body.about ? req.body.about : societe.about,  
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json({ err: err });
      if (result == null) return res.json({ data: [] });
      else return res.json({ data: result });
    }
  );
});
module.exports = router;
