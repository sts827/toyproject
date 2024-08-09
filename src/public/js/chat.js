// webSocket frontend handling
const socket = new WebSocket(`ws://${window.location.host}`);

const chatButton = document.querySelector("#chatBtn");

if (chatButton != null && chatButton != undefined) {
  chatButton.addEventListener("click", () => {
    if (chatButton.classList.contains("active")) {
      // class 제거
      chatButton.classList.remove("active");
      // chat close
      socket.addEventListener("close", () => {
        console.log("Disconnected server...");
      });
    } else {
      // class 추가
      chatButton.classList.add("active");
      // chat open
      socket.addEventListener("open", () => {
        console.log("connected server...");
      });
    }
  });
}

socket.addEventListener("message", (message) => {
  console.log("got this:..", message.data, "from the server..");
});
