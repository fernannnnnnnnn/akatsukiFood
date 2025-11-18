// File: api/order.js
// MENGGUNAKAN 'kv' (REDIS), BUKAN 'ec' (EDGE CONFIG)
import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://akatsuki-food-frontend.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'POST') {
    try {
      // Pastikan 'kv' ada
      if (!kv) {
        throw new Error("KV client is not initialized. (Have you connected the database in Vercel?)");
      }

      const items = await req.json();
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'Items must be non-empty array' }), {
          status: 400,
          headers,
        });
      }

      // Ambil data dari KV
      const ordersData = await kv.get('orders');
      // Pastikan itu adalah array
      const orders = Array.isArray(ordersData) ? ordersData : [];

      const newOrder = {
        id: Date.now(),
        items,
        total: items.reduce((sum, i) => sum + (i.price || 0), 0),
        time: new Date().toISOString(),
      };

      orders.push(newOrder);
      
      // Simpan data ke KV
      await kv.set('orders', orders);

      return new Response(JSON.stringify({ message: 'Order diterima', order: newOrder }), {
        status: 200,
        headers,
      });

    } catch (err) {
      console.error("KV ORDER (POST) ERROR:", err.message);
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
        status: 500,
        headers,
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers,
  });
}