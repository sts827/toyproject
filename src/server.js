import express, { application } from "express";
import http from "http";
import WebSocket from "ws";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// static resource 경로
app.use("/public", express.static(__dirname + "/public"));


// http + webSocket
const server = http.createServer(app);
const webSocket = new WebSocket.Server({ server });

// test webSocket backend handling -->
webSocket.on("connection", (socket) => {
  console.log("connected browser..");
  socket.send("hellow");
  socket.on("message", (message) => {
    console.log(message);
  });
});

// route 설정
const homeRoute = require("./routes/home");
const aboutRoute = require("./routes/about");
const mapRoute = require("./routes/globeMap");
const gptRoute = require("./routes/gemini");

app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/map", mapRoute);
app.use("/gpt", gptRoute);

server.listen(3000);

// console.log("server is listening");
// app.listen(3000);
