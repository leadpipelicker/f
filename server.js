const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/proxy', async (req, res) => {
  const scitelyUrl = 'https://api.scitely.com/v1/chat/completions';
  
  try {
    const response = await fetch(scitelyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SCITELY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
