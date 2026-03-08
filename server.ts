import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Proxy for Kick
  app.get('/api/kick/:user', async (req, res) => {
    const { user } = req.params;
    try {
      // Trying to fetch from Kick's internal API if possible, or scrape.
      // Since Kick uses Cloudflare, direct scraping might be hard.
      // However, for this demo, we will try a known endpoint.
      // If this fails, we might need to rely on client-side or a different method.
      // Note: This is a best-effort attempt.
      
      const response = await axios.get(`https://kick.com/api/v1/channels/${user}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://kick.com/'
        },
        timeout: 5000
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error(`Error fetching data for ${user}:`, error.message);
      res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
