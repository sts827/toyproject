import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// static resource 경로
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));


const server = http.createServer(app);
const webSocket = new WebSocket.Server({ server });

server.listen(3000);

// console.log("server is listening");
// app.listen(3000);
