import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";

test("Server: endpoints and SPA routing", async () => {
  const PORT = 3019;
  const serverProcess = spawn("node", ["server/server.js"], {
    env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
    stdio: "pipe",
  });

  function request(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
      }).on("error", reject);
    });
  }

  try {
    await new Promise((r) => setTimeout(r, 1500));

    // Root
    const root = await request("/");
    assert.equal(root.statusCode, 200);
    assert.ok(root.body.includes("<!doctype html>"));

    // Health
    const health = await request("/api/health");
    assert.equal(health.statusCode, 200);
    const healthJson = JSON.parse(health.body);
    assert.equal(healthJson.success, true);
    assert.equal(healthJson.message, "QAZFRAZE AI backend is running");

    // SPA fallback
    const spa = await request("/games");
    assert.equal(spa.statusCode, 200);
    assert.ok(spa.body.includes("<!doctype html>"));

    // API 404
    const badApi = await request("/api/nonexistent-route");
    assert.equal(badApi.statusCode, 404);
    const badJson = JSON.parse(badApi.body);
    assert.equal(badJson.success, false);
    assert.equal(badJson.error, "API endpoint табылмады.");
  } finally {
    serverProcess.kill();
  }
});
