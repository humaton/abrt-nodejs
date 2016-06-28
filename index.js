const net = require('net');
var Socket = require('net').Socket;
var client = new Socket();
// TODO: Get VAR_RUN from ABRT configuration.
var ABRT_SOCKET_PATH =  '/var/run/abrt/abrt.socket'

process.on('uncaughtException', (err) => {
    client.connect({path: ABRT_SOCKET_PATH}, function(){
      client.write("PUT / HTTP/1.1\r\n\r\n");
      client.write("PID=" + process.pid + "\0");
      client.write("EXECUTABLE=" + process.execPath + "\0");
      client.write("ANALYZER=Nodejs\0");
      client.write("TYPE=Javascript\0");
      client.write("BASENAME=jshook\0");
      client.write("REASON=" + err.message + "\0");
      client.write("BACKTRACE=" + err.stack + "\0");
      client.end();
      console.log('data writen to abrt socket');
    });  
    client.on('data', (data) => {
      console.log("recieved from abrt server: " + data.toString())
      client.end();
    });
    client.on('end', () => {
      console.log('disconnected from server');
    });  

});


  