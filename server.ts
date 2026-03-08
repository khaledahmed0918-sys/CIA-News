import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Proxy for ImgBB
  app.post('/api/upload-image', async (req, res) => {
    try {
      const form = new URLSearchParams();
      form.append('image', req.body.image);
      const response = await axios.post('https://api.imgbb.com/1/upload', form, {
        params: { key: process.env.IMGBB_API_KEY },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to upload image', details: error.response?.data || error.message });
    }
  });

  // API Proxy for Supabase
  const SUPABASE_URL = 'https://anrqyphpruggaxvepxxb.supabase.co';
  const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucnF5cGhwcnVnZ2F4dmVweHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODQ0NDEsImV4cCI6MjA4ODU2MDQ0MX0.PDRzYd3K_tZgXVvriYiU0oQ7XC-vnzPPxkI7eLRNPHo';

  const supabaseHeaders = {
    'apikey': SUPABASE_API_KEY,
    'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  app.post('/api/characters', async (req, res) => {
    try {
      const response = await axios.post(`${SUPABASE_URL}/rest/v1/characters`, req.body, { headers: supabaseHeaders });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add character', details: error.message });
    }
  });

  app.get('/api/characters', async (req, res) => {
    try {
      const response = await axios.get(`${SUPABASE_URL}/rest/v1/characters?select=*&apikey=${SUPABASE_API_KEY}`, { headers: supabaseHeaders });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch characters', details: error.message });
    }
  });

  app.post('/api/analyze', async (req, res) => {
    try {
      const response = await axios.post(`${SUPABASE_URL}/rest/v1/analyze`, req.body, { headers: supabaseHeaders });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add analysis', details: error.message });
    }
  });

  app.get('/api/analyze', async (req, res) => {
    try {
      const response = await axios.get(`${SUPABASE_URL}/rest/v1/analyze?select=*&apikey=${SUPABASE_API_KEY}`, { headers: supabaseHeaders });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch analysis', details: error.message });
    }
  });

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
