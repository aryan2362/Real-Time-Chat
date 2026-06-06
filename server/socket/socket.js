const Message = require("../models/Message");
let onlineUsers = [];

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    onlineUsers.push(socket.id);

io.emit(
  "onlineUsers",
  onlineUsers.length
);


    console.log(
      "User Connected:",
      socket.id
    );
socket.on(
  "typing",
  (name) => {

    socket.broadcast.emit(
      "typing",
      name
    );

  }
);

    socket.on(
      "sendMessage",
      async (data) => {

        try {

         const newMessage = await Message.create({

  sender: data.user,
  text: data.text

});

io.emit(
  "receiveMessage",
  newMessage
);

         

        } catch (error) {

          console.log(error);

        }

      }
    );

  socket.on(
  "disconnect",
  () => {

    onlineUsers =
      onlineUsers.filter(
        (id) => id !== socket.id
      );

    io.emit(
      "onlineUsers",
      onlineUsers.length
    );

    console.log(
      "User Disconnected:",
      socket.id
    );

  }
);

  });

};

module.exports = socketHandler;