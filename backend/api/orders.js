// File: api/orders.js
// MENGGUNAKAN 'kv' (REDIS), BUKAN 'ec' (EDGE CONFIG)
import { kv } from '@vercel/kv';

// BARIS 'config' SUDAH DIHAPUS. Ini akan menggunakan runtime default (Node.js).

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

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    if (!kv) {
      throw new Error("KV client is not initialized. (Have you connected the database in Vercel?)");
    }

    // Ambil data dari KV
    const ordersData = await kv.get('orders');
    
    // Pastikan itu adalah array
    const orders = Array.isArray(ordersData) ? ordersData : [];

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error("KV ORDERS (GET) ERROR:", err.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
      status: 500,
      headers,
    });
  }
}