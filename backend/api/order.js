// File: api/order.js
import { ec } from '../lib/edgeConfig'; // <-- PERUBAHAN DI SINI

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://akatsuki-food-frontend.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'POST') {
    try {
      // Pastikan 'ec' ada sebelum digunakan (tes keamanan tambahan)
      if (!ec) {
        throw new Error("Edge Config client is not initialized.");
      }

      const items = await req.json();
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'Items must be non-empty array' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Ambil data
      const ordersData = await ec.get('orders');
      // Pastikan itu adalah array
      const orders = Array.isArray(ordersData) ? ordersData : [];

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
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error("EDGE ORDER ERROR:", err.message);
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}