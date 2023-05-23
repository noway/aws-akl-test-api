const dgram = require("dgram");
const server = dgram.createSocket("udp4");
require("dotenv").config();

const clients = new Map();

function decode(buffer) {
  var x = buffer.readFloatBE(1);
  var y = buffer.readFloatBE(5);
  return [x, y];
}

server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on("message", (msg, rinfo) => {
  if (msg[0] === 1) {
    console.log(`server got: hello from ${rinfo.address}:${rinfo.port}`);
    clients.set(rinfo.address + rinfo.port, [rinfo.address, rinfo.port])
  } else {
    clients.set(rinfo.address + rinfo.port, [rinfo.address, rinfo.port])
    const coords = decode(msg);
    console.log(`${coords[0].toFixed(3)}, ${coords[1].toFixed(3)}`)
    const clientsValues = clients.values()
    for (const client of clientsValues) {
      server.send(msg, client[1], client[0]);
    }
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.PORT);