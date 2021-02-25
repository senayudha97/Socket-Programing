var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

connections = [];

server.listen(3000);
console.log("Server is running...");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("Terhubung: %s socket sedang terhubung", connections.length);

  // Disconnect
  socket.on("disconnect", function (data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Terputus: %s socket sedang terhubung", connections.length);
  });

  // Send Message
  socket.on("send message", function (data) {
    socket.join(data.room);
    io.sockets.to(data.room).emit("new message", {
      usr: data.username,
      msg: data.message,
    });
  });
});
