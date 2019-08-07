"use Strict";

// Creates the path to get the data from reply.js
const replies = require("./reply.js");

// Define variables
const PORT = process.env.PORT || 8080;

// Import net module
const net = require("net");

// Create a TCP Server
const server = net.createServer(socket => {
  // set encoding tp utf8
  socket.setEncoding("utf8");
  // add "on" event listener
  socket.on("data", data => {
    // read incoming data
    console.log(data.toString());

    // parse the string
    let index = data.slice(data.indexOf("/"), data.indexOf("HTTP") - 1);

    // Empty Response Header
    let response = "";
    let resStatus = "";
    let resType = "";
    let resLength = 0;
    let resConnection = "";

    // grab the right file
    replies.forEach(e => {
      if (index === e.request) {
        resStatus = e.status;
        resType = e.type;
        resLength = e.content.length;
        resConnection = e.connection;
        resContent = e.content;
      }
    });

    response = `HTTP/1.1 ${resStatus}
Server: lnozaki/1.7.9 (Darwin)
Date: ${new Date()}
Content-Type: ${resType}
Content-Length: ${resLength}
Connection: ${resConnection}

${resContent}`;

    console.log(response);
    // write outgoing data
    socket.end(response);
  });

  socket.on("end", () => {
    // handle client disconnect
    console.log("Connection has ended");
  });

  socket.on("error", error => {
    // handle error in connection
    if (error) throw error;
    console.log("There was an error.");
  });
});

// Server is running
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
