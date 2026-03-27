app.post('/proxy', async (req, res) => {
  try {
    console.log('→ Forwarding request to Scitely...');
    console.log('Headers sent:', {
      Authorization: 'Bearer [REDACTED]', // Don't log full key!
      'Content-Type': 'application/json'
    });
    console.log('Body sent:', JSON.stringify(req.body, null, 2));

    const scitelyResponse = await fetch('https://api.scitely.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SCITELY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('← Scitely responded with status:', scitelyResponse.status);

    // Even if status is 4xx/5xx, try to read body
    const data = await scitelyResponse.text(); // Use .text() first to avoid JSON parse errors
    console.log('Scitely response body:', data);

    // Try to parse as JSON only if valid
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON from Scitely', raw: data });
    }

    res.status(scitelyResponse.status).json(jsonData);
  } catch (error) {
    console.error('🔥 Proxy error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
});
