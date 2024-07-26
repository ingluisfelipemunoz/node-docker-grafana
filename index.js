const express = require("express");
const Prometheus = require("prom-client");

const app = express();
const port = 3105;

const requestCounter = new Prometheus.Counter({
  name: "node_request_count",
  help: "Number of requests received",
});

const requestDuration = new Prometheus.Histogram({
  name: "node_request_duration_seconds",
  help: "Duration of requests in seconds",
  labelNames: ["method", "path"],
});

// Middleware to measure request duration
app.use((req, res, next) => {
  requestCounter.inc();
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    requestDuration.observe(
      { method: req.method, path: req.path },
      duration / 1000
    );
  });
  next();
});

app.get("/", (req, res) => {
  console.log({ message: "holaaa", id: 1 });
  res.send("test test test!");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", Prometheus.register.contentType);
  const metrics = await Prometheus.register.metrics();
  res.end(metrics);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
