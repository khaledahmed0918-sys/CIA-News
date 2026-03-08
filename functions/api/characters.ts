export async function onRequest(context) {
  const SUPABASE_URL = 'https://anrqyphpruggaxvepxxb.supabase.co';
  const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucnF5cGhwcnVnZ2F4dmVweHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODQ0NDEsImV4cCI6MjA4ODU2MDQ0MX0.PDRzYd3K_tZgXVvriYiU0oQ7XC-vnzPPxkI7eLRNPHo';

  const supabaseHeaders = {
    'apikey': SUPABASE_API_KEY,
    'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const { request } = context;

  if (request.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/characters?select=*&apikey=${SUPABASE_API_KEY}`, {
        headers: supabaseHeaders
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch characters', details: error.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/characters`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to add character', details: error.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
