export async function onRequest(context) {
  const { request, params } = context;
  const user = params.user;

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${user}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://kick.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kick API v2 returned ${response.status}`);
    }
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    try {
      const responseV1 = await fetch(`https://kick.com/api/v1/channels/${user}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://kick.com/'
        }
      });
      
      if (!responseV1.ok) {
        throw new Error(`Kick API v1 returned ${responseV1.status}`);
      }
      
      const dataV1 = await responseV1.json();
      return new Response(JSON.stringify(dataV1), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (fallbackError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch data', details: fallbackError.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }
}
