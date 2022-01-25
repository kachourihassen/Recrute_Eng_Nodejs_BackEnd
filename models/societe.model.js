const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Societe = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    profession: String,
    date: String,
    titleline: String,
    about: String,
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Societe", Societe);
