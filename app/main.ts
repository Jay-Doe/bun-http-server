import * as net from "net";

console.log("Logs from your program will appear here!");

type RequestLine = [method: string, path: string, version: string];
type Headers = Map<string, string>;
const okResponse = "HTTP/1.1 200 OK\r\n\r\n";
const notFoundResponse = "HTTP/1.1 404 Not Found\r\n\r\n"

function getRequestLine(head: string): [RequestLine, string] {
  let [x, ...headerLines] = head.split("\r\n");
  let line = x.split(" ");
  let y = headerLines.join("\r\n");
  return [line, y] as [RequestLine, string];
}
function getHeaders(line: RequestLine, rawHeaders: string): [RequestLine,  Headers] {
  const headerLines = rawHeaders.split("\r\n");
  //reduce block
  const headers = headerLines.reduce((acc, headerLine) => {
    const i = headerLine.indexOf(":");
    return acc.set(
      headerLine.slice(0, i).toLowerCase(),
      headerLine.slice(i + 1).trim(),
    );
  }, new Map<string, string>() as Headers);
  // reduce end
  return [line, headers];
}
function handleConnection(socket: net.Socket): void {
  // per-connection scope,  since this is one giant handler function called for each new socket
  let acc = Buffer.alloc(0);

  socket.on("close", () => {
    socket.end();
  });
  socket.on("data", (chunk: Buffer) => {
    acc = Buffer.concat([acc, chunk]);
    const sep = acc.indexOf("\r\n\r\n");
    if (sep == -1) return;
    const head = acc.subarray(0, sep).toString("ascii");
    const [reqLine, rawHead] = getRequestLine(head);
    const [request, headers] = getHeaders(reqLine, rawHead);
    if (request[1] != "/") {
      socket.end(notFoundResponse);
      return;
    }
    socket.end(okResponse);


  });
}
const server = net.createServer(handleConnection);

server.listen(4221, "localhost");
