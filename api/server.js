#!/usr/bin/env node
const express = require('express');
const fetch = require('node-fetch');
const morgan = require('morgan');

const PORT = process.env.PORT || 4005;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('[posecompose-api] GEMINI_API_KEY not set');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '30mb' }));
app.use(morgan('combined'));

// Health
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Proxy to Gemini: fixed model and method used by the app
app.post('/api/gemini/generate-content', async (req, res) => {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status);
    // Pass JSON or error through transparently
    res.setHeader('content-type', r.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (err) {
    console.error('[proxy error]', err);
    res.status(502).json({ error: 'Upstream error' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[posecompose-api] listening on 127.0.0.1:${PORT}`);
});
