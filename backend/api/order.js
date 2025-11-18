// File: api/order.js
import { ec } from '@vercel/edge-config'; // Pastikan impor ini benar

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Definisikan headers CORS Anda
  const headers = {
    'Access-Control-Allow-Origin': 'https://akatsuki-food-frontend.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 1. Handle Preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    // Balas dengan headers CORS
    return new Response(null, { status: 200, headers });
  }

  // 2. Handle POST request
  if (req.method === 'POST') {
    try {
      const items = await req.json();
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'Items must be non-empty array' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }, // Jangan lupa headers di sini
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

      // Respons sukses
      return new Response(JSON.stringify({ message: 'Order diterima', order: newOrder }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }, // dan di sini
      });

    } catch (err) {
      console.error("EDGE ORDER ERROR:", err);
      // Respons error
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }, // dan di sini
      });
    }
  }

  // 3. Handle method lain (GET, PUT, dll)
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...headers, 'Content-Type': 'application/json' }, // dan di sini
  });
}