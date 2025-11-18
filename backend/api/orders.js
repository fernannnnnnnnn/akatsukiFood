// File: api/orders.js
import { ec } from '../lib/edgeConfig'; // <-- PERUBAHAN DI SINI

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://akatsuki-food-frontend.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Selalu tambahkan ini untuk konsistensi respons JSON
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
    // Cek keamanan tambahan, pastikan 'ec' terdefinisi
    if (!ec) {
      throw new Error("Edge Config client is not initialized.");
    }

    // === PERBAIKAN Logika Pengambilan Data ===
    // 1. Ambil data
    const ordersData = await ec.get('orders');
    // 2. Pastikan itu adalah array
    const orders = Array.isArray(ordersData) ? ordersData : [];
    // === SELESAI ===

    // Kirim respons sukses
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers, // headers sudah termasuk 'Content-Type': 'application/json'
    });

  } catch (err) {
    console.error("EDGE ORDERS (GET) ERROR:", err.message);
    // Kirim respons error
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
      status: 500,
      headers,
    });
  }
}