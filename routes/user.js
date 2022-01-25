const express = require("express");
//const { createIndexes } = require("../models/users.model");
const User = require("../models/users.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const router = express.Router();

router.route("/:username").get((req,res)=>{
    User.findOne({username:req.params.username},(err, result)=>{
            if(err) return res.status(500).json({msg: err});
            res.json({
                data: result,
                usermane: req.params.username,
            });
        }
    );
    });
   
    router.route("/checkusername/:username").get((req,res)=>{
        User.findOne({username:req.params.username},(err, result)=>{
            if(err) return res.status(500).json({msg: err});
            if(result !== null){
                return res.json({
                    Status: true,
                });
            }else
            return res.json({
                Status: false,
            });
        }
    );
    });

    router.route("/login").post((req,res)=>{
        User.findOne({username:req.body.username},(err, result)=>{
                if(err) return res.status(500).json({msg: err});
                if(result === null){
                    return res.status(403).json("Username is incorrect")

                }
                if(result.password === req.body.password)
                {   let token = jwt.sign({username: req.body.username},config.key,{
                    expiresIn: "24H",
                });
                    res.json({
                        token: token,
                        msg: "success",
                    });
                }
                else{
                    res.status(403).json("password is incorrect"); 
                }
            });
        });


router.route("/register").post((req,res) =>{
    console.log("inside the register");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,

    });
    user
    .save()
    .then(()=>{
        console.log("user registered");
        res.status(200).json("Ok");
    })
    .catch((err)=>{
        res.status(403).json({msg : err});
    });
});
router.route("/update/:username").patch(middleware.checkToken,(req,res)=>{
//User.findOneAndUpdate(
User.updateMany(
    {username:req.params.username},
    {$set: {password: req.body.password}},
    (err, result)=>{
        if(err) return res.status(500).json({msg: err});
        const msg ={
            msg: "password successfuly updated",
            usermane: req.params.username,

        };
        return res.json(msg);
    }
);
});
router.route("/updateps/:username").patch((req,res)=>{
    //User.findOneAndUpdate(
    User.updateMany(
        {username:req.params.username},
        {$set: {password: req.body.password}},
        (err, result)=>{
            if(err) return res.status(500).json({msg: err});
            const msg ={
                msg: "password successfuly updated",
                usermane: req.params.username,
            };
            return res.json(msg);
        }
    );
    });

router.route("/delete/:username").delete(middleware.checkToken,(req,res)=>{
    User.findOneAndDelete({username:req.params.username},(err, result)=>{
            if(err) return res.status(500).json({msg: err});
            const msg ={
                msg: "User deleted",
                usermane: req.params.username,
            };
            return res.json(msg);
        }
    );
    });
  

module.exports = router;