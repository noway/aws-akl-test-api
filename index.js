const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const clients = []

function decode(buffer) {
    var x = buffer.readDoubleBE(1);
    var y = buffer.readDoubleBE(9);
    return [x, y];
}

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  if (msg[0] === 1) {
	  console.log(`server got: hello from ${rinfo.address}:${rinfo.port}`);
	  clients.push([rinfo.address, rinfo.port])
  }
  else {
	  const coords = decode(msg);
	  console.log(`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`)
	  for(var i = 0; i < clients.length; i++) {
		  var client = clients[i];
			  server.send(msg, client[1], client[0])
	  }
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(65536);
// server listening on port 65536
