const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Cv = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    username: String,
    lastname: String,
    title: String,
    email: String,
    mobile: String,
    adress: String,
    date: String,
    about: String,
    education: String,
    skills: String,
    experience: String,
    intere: String,
    reference: String,
    
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Cv", Cv);