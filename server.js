const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/proxy', async (req, res) => {
  try {
    const scitelyResponse = await fetch('https://api.scitely.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SCITELY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await scitelyResponse.json();
    res.status(scitelyResponse.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to reach Scitely API' });
  }
});

app.get('/', (req, res) => {
  res.send('Scitely Proxy is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
