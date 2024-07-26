const express = require('express')
const Prometheus = require('prom-client')
const app = express()
const port = 3000

const requestCounter = new Prometheus.Counter({
  name: 'node_request_count',
  help: 'Number of requests received',
})

// to count requests
app.use((req, res, next) => {
  requestCounter.inc()
  next()
})

app.get('/', (req, res) => {
  res.send('test test test!')
})

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
