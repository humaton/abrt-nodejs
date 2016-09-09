const net = require('net');
var Socket = net.Socket;
var client = new Socket();
// TODO: Get VAR_RUN from ABRT configuration.
var ABRT_SOCKET_PATH =  '/var/run/abrt/abrt.socket'

process.on('uncaughtException', (err) => {
    try {
    client.connect({path: ABRT_SOCKET_PATH}, function(){
      client.write("PUT / HTTP/1.1\r\n\r\n");
      client.write("PID=" + process.pid + "\0");
      client.write("EXECUTABLE=" + process.argv[1] + "\0");
      client.write("ANALYZER=Node.js\0");
      client.write("TYPE=JavaScript\0");
      client.write("BASENAME=jshook\0");
      client.write("REASON=" + err.message + "\0");
      client.write("BACKTRACE=" + err.message + "\n\n" + err.stack + "\0");
      client.end();
    });
    }
    catch(err) {
      console.log("Error in connection to abrt socket is abrt running?")
    }
  
    client.on('data', (data) => {
      response_parts = data.toString().split(" ");
      response_code = parseInt(response_parts[1])
      if (response_code >= 400) {
        console.log("Error when sending data to abrt server: " + data.toString())
      }      
      client.end();
    });
});


  
