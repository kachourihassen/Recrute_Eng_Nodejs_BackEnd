const express = require("express");
const router = express.Router();
const Cv = require("../models/cv.model");
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

//adding and update CV image
// router
//   .route("/add/imagecv")
//   .patch(middleware.checkToken, upload.single("img"), (req, res) => {

//           const update = {
//             img: req.file.path,
//           }
//             Cv.updateMany(update, (err,cv) => {
        
//               if (err) return res.status(500).send(err);
//               const response = {
//                 message: "image added successfully updated",
//                 data: cv,
//               };
//               return res.status(200).send(response);
            
//             })
           
//         });
router
.route("/add/imagecv")
   .patch(middleware.checkToken, upload.single("img"), (req, res) => {
    Cv.findOneAndUpdate(
      {  name: req.decoded.username },
      {
        $set: {
          img: req.file.path,
        },
      },
      { new: true },
      (err, cv) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: cv,
        };
        return res.status(200).send(response);
      }
    );
  });
 
 

router.route("/addcv").post(middleware.checkToken, (req, res) => {
  const cv =  Cv({
    name: req.decoded.username,
    username: req.body.username,
    lastname: req.body.lastname,
    title: req.body.title,
    email: req.body.email,
    mobile: req.body.mobile,
    adress: req.body.adress,
    about: req.body.about,
    education: req.body.education,
    skills: req.body.skills,
    experience: req.body.experience,
    intere: req.body.intere,
    reference: req.body.reference,
    date: req.body.date,
  });
  cv
    .save()
    .then(() => {
      return res.json({ msg: "Curriculum Vitae successfully stored" });
    })
    .catch((err) => {
      return res.status(400).json({ err: err });
    });
  
});

// Check cv data


router.route("/getDatacv").get(middleware.checkToken, (req, res) => {
  Cv.findOne({ name: req.decoded.username }, (err, result) => {
    if (err) return res.json({ err: err });
    if (result == null) return res.json({ data: [] });
    else return res.json({ data: result });
  });
});
router.route("/updatecv").patch(middleware.checkToken, async (req, res) => {
  
  const update = {username: req.body.username ,  
        lastname: req.body.lastname,  
        title: req.body.title,  
        email: req.body.email,  
        mobile: req.body.mobile,  
        adress: req.body.adress,  
        date: req.body.date,  
        about: req.body.about,  
        education: req.body.education, 
        skills: req.body.skills,  
        experience: req.body.experience, 
        intere: req.body.intere,  
        reference: req.body.reference }
  
        Cv.updateMany(update, (err,raw) => {
          if (err) {
              
              return res
                  .status(500)
                  .send({error: "unsuccessful"})
          };
         
          return res.send({success: "success Update"});
      });
  
  });
  router.route("/deletecv").delete(middleware.checkToken,(req,res)=>{
    Cv.deleteMany({username: req.body.username},function(err, raw) {
      if (err) {
              
        return res
            .status(500)
            .send({error: "unsuccessful"})
    };
   
    return res.send({success: "success Delete"});
});
 
});
module.exports = router;

// router.route("/checkcv").get(middleware.checkToken, (req, res) => {
//   Cv.findOne({ username: req.decoded.username }, (err, result) => {
//     if (err) return res.json({ err: err });
//     else if (result == null) {
//       return res.json({ status: false, username: req.decoded.username });
//     } else {
//       return res.json({ status: true, username: req.decoded.username });
//     }
//   });
// });