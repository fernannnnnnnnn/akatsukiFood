// File: api/order.js
import { ec } from '@vercel/edge-config'; // Impor 'ec' yang benar
import { NextResponse } from 'next/server'; // Gunakan NextResponse

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
    // 'new Response' juga boleh, tapi kita konsisten pakai NextResponse jika bisa
    // 'new Response(null, { status: 200, headers })' juga valid
    return new NextResponse(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const items = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Items must be non-empty array' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // 'ec' ini sekarang akan berfungsi karena diimpor dari '@vercel/edge-config'
    const orders = (await ec.get('orders')) || [];

    const newOrder = {
      id: Date.now(),
      items,
      total: items.reduce((sum, i) => sum + (i.price || 0), 0),
      time: new Date().toISOString(),
    };

    orders.push(newOrder);
    await ec.set('orders', orders);

    return new NextResponse(JSON.stringify({ message: 'Order diterima', order: newOrder }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("EDGE ORDER ERROR:", err);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}