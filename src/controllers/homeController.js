
const chatService = require("../services/chatService");
const mapService = require("../services/mapService");
const gptService = require("../services/gptService");

exports.getHomePage = (req, res) => {
  res.render("home", {
    title: "Home",
    message:"Welcome!!"
  });
};
