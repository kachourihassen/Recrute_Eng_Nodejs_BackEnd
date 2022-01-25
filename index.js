const express = require("express")
const app = express()
const mongoose = require("mongoose")
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    userCreateIndex: true,
    userUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open",()=> {
    console.log("MongoDB connected")
});
const Port = process.env.Port || 5000;
app.route("/").get((req,res)=>res.json("API Kachouri"));
app.listen(Port, ()=>console.log(`server running on port ${Port}`));

//
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user",userRoute);

const profileRoute = require("./routes/profile");
app.use("/profile", profileRoute);

const cvRoute = require("./routes/cv");
app.use("/cv", cvRoute);

const offerRoute = require("./routes/offer");
app.use("/offer", offerRoute);

const societeRoute = require("./routes/societe");
app.use("/societe",societeRoute);


app.use("/uploads", express.static("uploads"));
app.use(express.json());

