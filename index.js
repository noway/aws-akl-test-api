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
	  //console.log(`server got: ${coords} from ${rinfo.address}:${rinfo.port}`);
	  for(var i = 0; i < clients.length; i++) {
		  var client = clients[i];
		  //if (rinfo.address !== client[0] && rinfo.port !== client[1]) {
			  server.send(msg, client[1], client[0])
		  //}
	  }
	  //if (msg.toString() === 'ping') {
	  //  server.send('pong', rinfo.port, rinfo.address, (err) => {
	  //    if (err) console.log(err);
	  //    console.log('Sent: pong');
	  //  });
	  //}
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(65536);
// server listening on port 65536
