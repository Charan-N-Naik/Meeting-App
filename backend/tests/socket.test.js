import { describe, test, before, after } from "node:test";
import assert from "node:assert";
import { createServer } from "node:http";
import { connectToSocket } from "../src/controller/Socketmaneger.js";

describe("Socketmaneger WebRTC Signaling & Real-Time Chat Unit Tests", () => {
  let io;
  let server;

  before(async () => {
    server = createServer();
    io = connectToSocket(server);
    await new Promise((resolve) => server.listen(0, resolve));
  });

  after(async () => {
    if (io) io.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  test("Socket server initializes correctly", () => {
    assert.notStrictEqual(io, undefined);
    assert.strictEqual(typeof io.on, "function");
  });
});
