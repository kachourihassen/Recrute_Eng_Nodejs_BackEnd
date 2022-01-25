const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Annonce = Schema(
  { 
    nomentr: String,
    poste: String,
    anexp: String,
    descentr: String,
    descpost: String,
    typecont: String,
    sexe: String,
    adress: String,
    salaire: String,
    skills:String,
    user:String,
    
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Annonce", Annonce);
