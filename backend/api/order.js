import { ec } from '../edgeConfig';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://akatsuki-food-frontend.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    const items = await req.json(); // parse JSON body
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Items must be non-empty array' }), {
        status: 400,
        headers,
      });
    }

    const orders = (await ec.get('orders')) || [];

    const newOrder = {
      id: Date.now(),
      items,
      total: items.reduce((sum, i) => sum + (i.price || 0), 0),
      time: new Date().toISOString(),
    };

    orders.push(newOrder);
    await ec.set('orders', orders);

    return new Response(JSON.stringify({ message: 'Order diterima', order: newOrder }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("EDGE ORDER ERROR:", err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers,
    });
  }
}
