import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectToSocket } from "../src/controller/Socketmaneger.js";

describe("Socketmaneger WebRTC Signaling & Real-Time Chat Unit Tests", () => {
  let io;
  let server;

  beforeAll((done) => {
    server = createServer();
    io = connectToSocket(server);
    server.listen(0, () => {
      done();
    });
  });

  afterAll((done) => {
    io.close();
    server.close();
    done();
  });

  test("Socket server initializes correctly", () => {
    expect(io).toBeDefined();
    expect(typeof io.on).toBe("function");
  });
});
