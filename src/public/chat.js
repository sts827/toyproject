// webSocket frontend handling
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected server..");
});

socket.addEventListener("message", (message) => {
  console.log("got this:..", message.data, "from the server..");
});

socket.addEventListener("close", () => {
  console.log("Disconnected server...");
});

setTimeout(() => {}, 500);
