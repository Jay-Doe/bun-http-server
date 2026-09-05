import * as net from "net";

console.log("Logs from your program will appear here!");

 const server = net.createServer((socket: net.Socket) => {
   socket.on("close", () => {
     socket.end();
   });
   socket.on("data", () => {
     const response = [
       "HTTP\\1.1 200 ok",
       "",
       "",
     ].join("\r\n");
     socket.end(response);

   });
 });

 server.listen(4221, "localhost");
